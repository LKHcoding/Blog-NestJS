import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from 'src/common/dto/user.dto';
import { BlogPosts } from 'src/entities/blog-posts';
import { ActionType, BlogPostsLike } from 'src/entities/blog-posts-like';
import {
  BlogPostsTags,
  DeveloperPositionType,
} from 'src/entities/blog-posts-tags';
import { Users } from 'src/entities/Users';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogPostsLike)
    private blogPostsLikeRepository: Repository<BlogPostsLike>,
    @InjectRepository(BlogPosts)
    private blogPostsRepository: Repository<BlogPosts>,
    @InjectRepository(BlogPostsTags)
    private blogPostsTagsRepository: Repository<BlogPostsTags>,
    private usersService: UsersService,
  ) {}

  //글쓰기
  async createPost(createBlogPostData: CreateBlogPostDto, user: UserDto) {
    const { title, tags, content, thumbnail } = createBlogPostData;

    // 각 태그를 BlogPostsTags 객체 형태로 바꿔주기
    const newTagListObj = tags.map((tagItem) => {
      let newItem = new BlogPostsTags();
      newItem.tagName = tagItem;
      newItem.positionType = user.positionType;
      return newItem;
    });

    // 이미 존재 하는 태그들 조회해보기
    const existTags = await this.blogPostsTagsRepository.find({
      where: newTagListObj,
    });

    // 이미 디비에 존재하는 태그는 저장하면 안되니 빼주는 로직
    for (let idx = newTagListObj.length - 1; 0 <= idx; idx--) {
      existTags.map((item) => {
        if (newTagListObj[idx]?.tagName === item?.tagName) {
          if (newTagListObj[idx].positionType === item.positionType) {
            newTagListObj.splice(idx, 1);
          }
        }
      });
    }

    // 존재하지 않는 태그는 Save 해주기
    let savedTags = null;
    if (newTagListObj.length !== 0) {
      savedTags = await this.blogPostsTagsRepository.save(newTagListObj);
    }

    const Post = new BlogPosts();
    Post.Tags = savedTags !== null ? [...savedTags, ...existTags] : existTags;
    Post.title = title;
    Post.content = content;
    Post.thumbnail = thumbnail;
    // Post.User = user;
    Post.UserId = user.id;

    const result = await this.blogPostsRepository.save(Post);

    return result;
  }

  // 태그별 게시물 수 구하기
  async findTagsInfoList(userID: string) {
    // 태그별 글 개수를 구하고 싶지만 typeorm으로 구하기 쉽지않다.
    // 데이터를 넘겨받은 다음 BlogPosts 의 length로 개수를 구할 수 있다.
    const tagInfoResult = await this.blogPostsTagsRepository
      .createQueryBuilder('tagList')
      .leftJoin('tagList.BlogPosts', 'posts')
      .leftJoin('posts.User', 'user')
      .where('user.loginID = :loginID', { loginID: userID })
      .select('tagList.tagName')
      .addSelect('posts.id')
      .getMany();

    //전체 글 갯수 구하기
    const allPostCount = await this.blogPostsRepository
      .createQueryBuilder('posts')
      .leftJoin('posts.User', 'user')
      .where('user.loginID = :loginID', { loginID: userID })
      .getCount();

    return { tagInfoResult, allPostCount };
  }

  //유저별 전체 게시물 정보 리스트
  async findPostsInfoList(userID: string) {
    return await this.blogPostsRepository
      .createQueryBuilder('posts')
      .leftJoin('posts.Tags', 'tags')
      .leftJoin('posts.User', 'user')
      .where('user.loginID = :loginID', { loginID: userID })
      .addSelect('tags.tagName')
      .getMany();

    //하나의 태그를 어떤 게시물들에서 사용했는지 게시물 다 가져오기
    // return await this.blogPostsTagsRepository
    //   .createQueryBuilder('blog-posts-tags')
    //   .where('blog-posts-tags.tagName IN (:...tags)', { tags: [tag, 'tag2'] })
    //   .leftJoinAndSelect('blog-posts-tags.BlogPosts', 'blog-posts')
    //   .getMany();
  }

  //유저별 특정 게시물 정보
  async findPostInfo(postId: string) {
    return await this.blogPostsRepository
      .createQueryBuilder('post')
      .leftJoin('post.Tags', 'tags')
      .leftJoin('post.LikeDisLike', 'likes')
      .where('post.id = :postId', { postId })
      .addSelect('tags.tagName')
      .addSelect('likes.UserId')
      .addSelect('likes.actionType')
      .getOne();
  }

  async updatePostLikeInfo(
    postId: string,
    actionType: ActionType,
    user: UserDto,
  ) {
    const isActionAlready = await this.blogPostsLikeRepository.findOne({
      PostId: +postId,
      UserId: user.id,
      actionType,
    });

    // console.log(isActionAlready);

    if (isActionAlready) {
      return await this.blogPostsLikeRepository.delete({
        id: isActionAlready.id,
      });
    }

    const likeDislike = new BlogPostsLike();
    likeDislike.actionType = actionType;
    likeDislike.PostId = +postId;
    likeDislike.UserId = user.id;
    return await this.blogPostsLikeRepository.save(likeDislike);
  }

  update(id: number, updateBlogDto: UpdateBlogDto) {
    return `This action updates a #${id} blog`;
  }

  remove(id: number) {
    return `This action removes a #${id} blog`;
  }
}

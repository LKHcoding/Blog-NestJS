import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import fs from 'fs';
import { AlgoliaService } from 'nestjs-algolia';
import { UserDto } from 'src/common/dto/user.dto';
import { BlogPosts } from 'src/entities/blog-posts';
import { ActionType, BlogPostsLike } from 'src/entities/blog-posts-like';
import { BlogPostsTags } from 'src/entities/blog-posts-tags';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';

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
    // for Algolia
    private readonly algoliaService: AlgoliaService,
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

    // algolia
    const index = this.algoliaService.initIndex('develogger-post');
    const algoliaData = await this.algoliaFindPost(result.id);
    // 게시글 내용에 태그를 지운다.
    algoliaData.content = algoliaData.content.replace(/(<([^>]+)>)/gi, '');

    // algolia에 데이터 삽입
    try {
      await index.addObject(algoliaData);
    } catch (error) {
      console.log('Algolia insert data error : ', error);
    }

    return result;
  }

  //글수정
  async updatePost(updateBlogPostData: UpdateBlogPostDto, user: UserDto) {
    const { id, title, tags, content, thumbnail } = updateBlogPostData;

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

    // const Post = new BlogPosts();
    const Post = await this.blogPostsRepository.findOne({ where: { id } });

    // 관리자면 패스
    if (user.role !== 'admin') {
      if (user.id !== Post.UserId) {
        throw new HttpException(
          '글 작성자가 아닙니다.',
          HttpStatus.UNAUTHORIZED,
        );
      }
    }

    Post.Tags = savedTags !== null ? [...savedTags, ...existTags] : existTags;
    Post.title = title;
    Post.content = content;
    Post.thumbnail = thumbnail;
    // Post.User = user;
    Post.UserId = user.id;

    const result = await this.blogPostsRepository.save(Post);

    // algolia update post data
    const index = this.algoliaService.initIndex('develogger-post');
    const algoliaData = await this.algoliaFindPost(result.id);
    algoliaData.content = algoliaData.content.replace(/(<([^>]+)>)/gi, '');

    // algolia 데이터 찾기
    const findResultObjectId = await index
      .search(algoliaData.User.loginID)
      .then(({ hits }) => {
        return hits.filter((item) => item.id === result.id);
      });

    try {
      await index
        .saveObject({
          ...algoliaData,
          objectID: findResultObjectId[0].objectID,
        })
        .then(() => {
          console.log('글 수정하고 algolia 데이터 업데이트 성공');
        });
    } catch (error) {
      console.log('Algolia update data error : ', error);
    }

    return result;
  }

  //글 삭제
  async deletePost(postId: number, user: UserDto) {
    const postDataResult = await this.blogPostsRepository.findOne({
      id: postId,
    });

    // 관리자면 패스
    if (user.role !== 'admin') {
      if (postDataResult.UserId !== user.id) {
        throw new HttpException(
          '글 작성자가 아닙니다.',
          HttpStatus.UNAUTHORIZED,
        );
      }
    }

    if (!postDataResult) {
      throw new HttpException(
        '존재하지 않는 게시물 입니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // 글 수정시는 썸네일을 새로 올리면 기존의 이미지는 지워준다.
    fs.unlink(postDataResult.thumbnail, (err) => {
      console.log('게시글 삭제 중 썸네일 파일 삭제 실패 : ', err);
      // throw new HttpException('파일 삭제 실패', HttpStatus.BAD_REQUEST);
    });

    // 실제 글 삭제 하기 전 algolia에서도 지우기 위해 미리 데이터를 가져온다.
    const algoliaData = await this.algoliaFindPost(postId);

    const deletedPostResult = await this.blogPostsRepository.delete({
      id: postDataResult.id,
    });

    // algolia record 삭제
    const index = this.algoliaService.initIndex('develogger-post');

    // algolia 데이터 찾기
    const findResultObjectId = await index
      .search(algoliaData.User.loginID)
      .then(({ hits }) => {
        return hits.filter((item) => item.id === postId);
      });

    console.log('--------------------------------', findResultObjectId);

    try {
      await index
        .deleteObjects([findResultObjectId[0].objectID])
        .then(({ objectIDs }) => {
          console.log('글 삭제 후 algolia data 삭제 성공 : ', objectIDs);
        });
    } catch (error) {
      console.log('Algolia delete data error : ', error);
    }

    return deletedPostResult;
  }

  // 태그별 게시물 수 구하기
  async findTagsInfoListByUser(userID: string) {
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

  // 유저의 포지션별 모든 태그 정보 찾기
  async findAllTagsInfoListByPosition(position: string) {
    const tagInfoResult = await this.blogPostsTagsRepository
      .createQueryBuilder('tagList')
      .where('tagList.positionType = :position', { position })
      .select('tagList.tagName')
      .getMany();

    return { tagInfoResult };
  }

  async findPostsInfoList(userID: string) {
    //유저별 전체 게시물 정보 리스트
    return await this.blogPostsRepository
      .createQueryBuilder('posts')
      .leftJoin('posts.Tags', 'tags')
      .leftJoin('posts.User', 'user')
      .leftJoin('posts.LikeDisLike', 'likes')
      .where('user.loginID = :loginID', { loginID: userID })
      .addSelect('tags.tagName')
      .addSelect('likes.UserId')
      .addSelect('likes.actionType')
      .getMany();
  }

  async findPostInfoByTagByUser(userID: string, tag: string) {
    //하나의 태그를 어떤 게시물들에서 사용했는지 게시물 다 가져오기 (각 유저별로)
    return (
      (
        await this.blogPostsRepository
          .createQueryBuilder('posts')
          .leftJoin('posts.User', 'user')
          .leftJoin('posts.Tags', 'tags')
          .leftJoin('posts.LikeDisLike', 'likes')
          .where('user.loginID = :loginID', { loginID: userID })
          // .andWhere('tags.tagName @> ARRAY[:tag]', {
          //   tag,
          // })
          .addSelect('tags.tagName')
          // .andHaving('tags.tagName = :tag', { tag })
          .addSelect('likes.UserId')
          .addSelect('likes.actionType')
          .getMany()
      ).filter((item) => {
        for (let index = 0; index < item.Tags.length; index++) {
          if (item.Tags[index].tagName === tag) {
            return true;
          }
        }
        return false;
      })
    );
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

  //전체 게시글 정보
  async findAllPostInfo() {
    return await this.blogPostsRepository
      .createQueryBuilder('posts')
      .leftJoin('posts.Tags', 'tags')
      .leftJoin('posts.LikeDisLike', 'likes')
      .leftJoin('posts.User', 'user')
      .orderBy('posts.createdAt', 'DESC')
      .addSelect('tags.tagName')
      .addSelect('likes.actionType')
      .addSelect('likes.UserId')
      .addSelect('user.loginID')
      .addSelect('user.avatarUrl')
      .addSelect('user.positionType')
      .addSelect('user.deletedAt')
      .getMany();
  }

  async algoliaFindPost(postId: number) {
    return await this.blogPostsRepository
      .createQueryBuilder('posts')
      .leftJoin('posts.Tags', 'tags')
      .leftJoin('posts.LikeDisLike', 'likes')
      .leftJoin('posts.User', 'user')
      .where('posts.id = :postId', { postId })
      .orderBy('posts.updatedAt', 'DESC')
      .addSelect('tags.tagName')
      .addSelect('likes.actionType')
      .addSelect('likes.UserId')
      .addSelect('user.loginID')
      .addSelect('user.avatarUrl')
      .addSelect('user.positionType')
      .addSelect('user.deletedAt')
      .getOne();
  }
}

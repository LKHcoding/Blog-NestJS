import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogPosts } from 'src/entities/blog-posts';
import {
  BlogPostsTags,
  DeveloperPositionType,
} from 'src/entities/blog-posts-tags';
import { Users } from 'src/entities/Users';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogPosts)
    private blogPostsRepository: Repository<BlogPosts>,
    @InjectRepository(BlogPostsTags)
    private blogPostsTagsRepository: Repository<BlogPostsTags>,
    private usersService: UsersService,
  ) {}

  create(createBlogDto: CreateBlogDto) {
    return 'This action adds a new blog';
  }

  async findAll() {
    // 임의로 입력받은 태그 리스트
    const TagList = ['tag', 'tag2', 'tag3'];

    // 객체 형태로 바꿔주기
    const newTagListObj = TagList.map((item) => {
      let newItem = new BlogPostsTags();
      newItem.tagName = item;
      newItem.positionType = DeveloperPositionType.FrontEnd;
      return newItem;
    });

    // 이미 존재 하는 태그들 조회해보기
    const existTags = await this.blogPostsTagsRepository.find({
      where: newTagListObj,
    });

    // 이미 디비에 존재하는 태그는 저장하면 안되니 빼주는 로직
    for (let idx = newTagListObj.length - 1; 0 <= idx; idx--) {
      existTags.map((item) => {
        if (newTagListObj[idx].tagName === item.tagName) {
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

    console.log('---------------------------------', newTagListObj);

    const Post = new BlogPosts();
    Post.Tags = savedTags !== null ? savedTags : existTags;
    Post.title = 'title2';
    Post.content = 'content2';
    Post.User = await this.usersService.findByLoginID('LKHcoding');
    Post.UserId = (await this.usersService.findByLoginID('LKHcoding')).id;

    const result = await this.blogPostsRepository.save(Post);

    return result;
    return await this.blogPostsRepository.find({ relations: ['Tags'] });
  }

  findOne(id: number) {
    return `This action returns a #${id} blog`;
  }

  update(id: number, updateBlogDto: UpdateBlogDto) {
    return `This action updates a #${id} blog`;
  }

  remove(id: number) {
    return `This action removes a #${id} blog`;
  }
}

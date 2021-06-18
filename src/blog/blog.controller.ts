import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/common/decorators/auth.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { UserDto } from 'src/common/dto/user.dto';
import { UserRole } from 'src/entities/Users';
import { BlogService } from './blog.service';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@ApiTags('BLOG')
@Controller('api/blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Auth(UserRole.User)
  @Post()
  async createNewPost(
    @Body() createBlogPostData: CreateBlogPostDto,
    @User() user: UserDto,
  ) {
    return await this.blogService.createPost(createBlogPostData, user);
  }

  //글쓰기 테스트
  @Get()
  findAll() {
    return this.blogService.findAll();
  }

  //하나의 태그에 게시된 글들 뭐있는지 조회해보기
  @Post('/:tag')
  findOne(@Param('tag') tag: string) {
    return this.blogService.findOne(tag);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogService.update(+id, updateBlogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogService.remove(+id);
  }
}

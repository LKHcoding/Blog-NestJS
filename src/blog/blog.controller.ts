import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/common/decorators/auth.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { UserDto } from 'src/common/dto/user.dto';
import { UserRole } from 'src/entities/Users';
import { BlogService } from './blog.service';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { ActionType } from 'src/entities/blog-posts-like';

try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}

@ApiTags('BLOG')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  //이미지 업로드 처리
  @Auth(UserRole.User)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: multer.diskStorage({
        destination(req, file, cb) {
          cb(null, 'uploads/');
        },
        filename(req, file, cb) {
          const ext = path.extname(file.originalname);
          cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  @Post('image')
  postImages(@UploadedFile() file: Express.Multer.File) {
    //이미지 업로드 후 경로만 반환한다.
    // return file.path.replaceAll('\\', '/');
    return file.path.replace(/\\/g, '/');
  }

  // 글쓰기
  @Auth(UserRole.User)
  @Post()
  async createNewPost(
    @Body() createBlogPostData: CreateBlogPostDto,
    @User() user: UserDto,
  ) {
    return await this.blogService.createPost(createBlogPostData, user);
  }

  // 유저별 태그 정보
  @Get('tags-info/:userID')
  async getTagsInfoList(@Param('userID') userID: string) {
    return await this.blogService.findTagsInfoList(userID);
  }

  // 유저별 전체 게시물 정보
  @Get('posts-info/:userID')
  async getPostsInfoList(@Param('userID') userID: string) {
    return await this.blogService.findPostsInfoList(userID);
  }

  // 유저별 특정 게시물 정보
  @Get('post-info/:postId')
  async getOnePostInfo(@Param('postId') postId: string) {
    return await this.blogService.findPostInfo(postId);
  }

  // 특정 게시물 좋아요, 싫어요 추가 삭제
  @Auth(UserRole.User)
  @Post('post-like/:postId/:actionType')
  async handlePostLike(
    @Param('postId') postId: string,
    @Param('actionType') actionType: ActionType,
    @User() user: UserDto,
  ) {
    return await this.blogService.updatePostLikeInfo(postId, actionType, user);
  }

  // 전체 게시물 정보
  @Get('all-posts-info')
  async getAllPostInfo() {
    return await this.blogService.findAllPostInfo();
  }

  // post list by tag by user
  @Get('posts-info-byTag/:userID/:tag')
  async getPostInfoByTagByUser(
    @Param('userID') userID: string,
    @Param('tag') tag: string,
  ) {
    return await this.blogService.findPostInfoByTagByUser(userID, tag);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
  //   return this.blogService.update(+id, updateBlogDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.blogService.remove(+id);
  // }
}

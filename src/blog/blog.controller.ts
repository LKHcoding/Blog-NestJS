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

try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}

@ApiTags('BLOG')
@Controller('api/blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  //이미지 업로드 처리
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
    return file.path;
  }

  @Auth(UserRole.User)
  @Post()
  async createNewPost(
    @Body() createBlogPostData: CreateBlogPostDto,
    @User() user: UserDto,
  ) {
    return await this.blogService.createPost(createBlogPostData, user);
  }

  @Get('tags-info/:userID')
  async getTagsInfoList(@Param('userID') userID: string) {
    return await this.blogService.findTagsInfoList(userID);
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

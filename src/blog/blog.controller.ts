import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Auth } from 'src/common/decorators/auth.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { UserDto } from 'src/common/dto/user.dto';
import { UserRole } from 'src/entities/Users';
import { BlogService } from './blog.service';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import { BlogPosts } from '../entities/blog-posts';
import { BlogPostsComment } from '../entities/blog-posts-comment';
import { AuthLoginRequestDto } from '../auth/dto/auth-login.request.dto';
import { CreateBlogCommentDto } from './dto/create-blog-comment.dto';

try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}

enum ActionType {
  Like = 'Like',
  DisLike = 'DisLike',
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

  // 글 수정
  @Auth(UserRole.User)
  @Post('update-post')
  async updatePost(
    @Body() updateBlogPostData: UpdateBlogPostDto,
    @User() user: UserDto,
  ) {
    if (updateBlogPostData.prevThumbnail !== '') {
      // console.log(updateBlogPostData.prevThumbnail);

      // 글 수정시 썸네일을 새로 올리면 기존의 이미지는 지워준다.
      fs.unlink(updateBlogPostData.prevThumbnail, (err) => {
        console.log('파일 삭제 실패 : ', err);
        // throw new HttpException('파일 삭제 실패', HttpStatus.BAD_REQUEST);
      });
    }

    return await this.blogService.updatePost(updateBlogPostData, user);
  }

  // 글 삭제
  @Auth(UserRole.User)
  @Delete('delete-post/:postId')
  async deletePost(@Param('postId') postId: string, @User() user: UserDto) {
    return await this.blogService.deletePost(+postId, user);
  }

  // 유저의 포지션별 모든 태그 정보
  @Get('tags-info')
  @Auth(UserRole.User)
  async getAllTagsInfoListByPosition(@User() user: UserDto) {
    return await this.blogService.findAllTagsInfoListByPosition(
      user.positionType,
    );
  }

  // 유저별 태그의 게시글 수 정보
  @Get('tags-info/:userID')
  async getTagsInfoListByUser(@Param('userID') userID: string) {
    return await this.blogService.findTagsInfoListByUser(userID);
  }

  // 유저별 전체 게시물 정보
  @Get('posts-info/:userID/:tag')
  async getPostsInfoList(
    @Param('userID') userID: string,
    @Param('tag') tag: string,
  ) {
    if (tag === 'all') {
      return await this.blogService.findPostsInfoList(userID);
    } else {
      return await this.blogService.findPostInfoByTagByUser(userID, tag);
    }
  }

  // 유저별 특정 게시물 정보
  @ApiResponse({
    status: 200,
    description: '성공',
    type: BlogPosts,
  })
  @Get('post-info/:postId')
  async getOnePostInfo(@Param('postId') postId: string): Promise<BlogPosts> {
    return await this.blogService.findPostInfo(postId);
  }

  // 특정 게시물 좋아요, 싫어요 추가 삭제
  @Auth(UserRole.User)
  @Post('post-like/:postId/:actionType')
  @ApiParam({
    name: 'actionType',
    enum: ActionType,
    enumName: 'ActionType',
  })
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

  // 게시글 별 코멘트 리스트 조회
  @ApiCookieAuth('Authentication')
  @ApiOperation({ summary: '게시글 별 코멘트 리스트 조회' })
  @ApiResponse({
    status: 200,
    description: '성공',
    type: [BlogPostsComment],
  })
  // comment list by postId
  @Get('comment/:postId')
  async getCommentInfoByPostId(@Param('postId') postId: string) {
    return await this.blogService.findCommentInfoByPostId(postId);
  }

  // 게시글 별 코멘트 작성
  @ApiCookieAuth('Authentication')
  @ApiOperation({ summary: '게시글 별 코멘트 작성' })
  @ApiResponse({
    status: 201,
    description: '성공',
    type: [BlogPostsComment],
  })
  @ApiBody({
    type: CreateBlogCommentDto,
  })
  @Auth(UserRole.User)
  @Post('comment')
  async postCommentByPostId(
    @Body() createCommentData: CreateBlogCommentDto,
    @User() user: UserDto,
  ) {
    return await this.blogService.createComment(createCommentData, user);
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

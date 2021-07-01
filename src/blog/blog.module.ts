import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { BlogPostsTags } from 'src/entities/blog-posts-tags';
import { BlogPosts } from 'src/entities/blog-posts';
import { BlogPostsLike } from 'src/entities/blog-posts-like';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, BlogPostsTags, BlogPosts, BlogPostsLike]),
  ],
  controllers: [BlogController],
  providers: [BlogService, UsersService],
  exports: [BlogService],
})
export class BlogModule {}

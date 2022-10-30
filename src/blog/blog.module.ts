import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { BlogPostsTags } from 'src/entities/blog-posts-tags';
import { BlogPosts } from 'src/entities/blog-posts';
import { BlogPostsLike } from 'src/entities/blog-posts-like';
import { AlgoliaModule } from 'nestjs-algolia';
import dotenv from 'dotenv';
import { BlogPostsComment } from '../entities/blog-posts-comment';

dotenv.config({
  path:
    process.env.NODE_ENV === 'production'
      ? '.env.production'
      : '.env.development',
});

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Users,
      BlogPostsTags,
      BlogPosts,
      BlogPostsLike,
      BlogPostsComment,
    ]),
    AlgoliaModule.register({
      applicationId: process.env.ALGOLIA_APP_ID,
      apiKey: process.env.ALGOLIA_API_KEY,
    }),
  ],
  controllers: [BlogController],
  providers: [BlogService, UsersService],
  exports: [BlogService],
})
export class BlogModule {}

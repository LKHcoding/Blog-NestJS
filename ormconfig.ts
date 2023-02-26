import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Users } from './src/entities/Users';
import dotenv from 'dotenv';
import { BlogPosts } from 'src/entities/blog-posts';
import { BlogPostsTags } from 'src/entities/blog-posts-tags';
import { BlogPostsLike } from 'src/entities/blog-posts-like';
import { BlogPostsComment } from './src/entities/blog-posts-comment';

dotenv.config({
  path:
    process.env.NODE_ENV === 'production'
      ? '.env.production'
      : '.env.development',
});

const config: TypeOrmModuleOptions = {
  type: 'mariadb',
  host: process.env.REMOTE_DB_HOST || process.env.DOMAIN,
  port: 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [Users, BlogPosts, BlogPostsTags, BlogPostsLike, BlogPostsComment],
  // migrations: [__dirname + '/src/migrations/*.ts'],
  // cli: { migrationsDir: 'src/migrations' },
  // entity 자동으로 불러오는 설정
  autoLoadEntities: true,
  charset: 'utf8mb4',
  synchronize: true,
  logging: true,
  keepConnectionAlive: true,
  timezone: '+09:00',
};

export = config;

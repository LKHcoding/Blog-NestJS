import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Users } from './src/entities/Users';
import dotenv from 'dotenv';
import { BlogPosts } from 'src/entities/blog-posts';
import { BlogPostsTags } from 'src/entities/blog-posts-tags';
import { BlogPostsLikeDislike } from 'src/entities/blog-posts-likeDislike';

dotenv.config();
const config: TypeOrmModuleOptions = {
  type: 'mariadb',
  host: 'localhost',
  port: 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [Users, BlogPosts, BlogPostsTags, BlogPostsLikeDislike],
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

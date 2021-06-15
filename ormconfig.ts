import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Users } from './src/entities/Users';
import dotenv from 'dotenv';
import { BlogPosts } from 'src/entities/BlogPosts';
import { BlogPostsTags } from 'src/entities/BlogPostsTags';

dotenv.config();
const config: TypeOrmModuleOptions = {
  type: 'mariadb',
  host: 'localhost',
  port: 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [Users, BlogPosts, BlogPostsTags],
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

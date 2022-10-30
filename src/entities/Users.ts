import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BlogPosts } from './blog-posts';
import { BlogPostsLike } from './blog-posts-like';
import { BlogPostsComment } from './blog-posts-comment';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  User = 'user',
  Admin = 'admin',
}

export enum loginType {
  Local = 'local',
  Github = 'github',
}

export enum DeveloperPositionType {
  FrontEnd = 'Front-End',
  BackEnd = 'Back-End',
  FullStack = 'Full-Stack',
}

@Entity({ schema: 'nesttest', name: 'users' })
export class Users {
  @ApiProperty({
    example: '1',
    description: 'Primary key ID',
  })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @ApiProperty({
    example: 'NestMaster',
    description: 'githubID',
  })
  @Column({ type: 'int', name: 'githubID', default: null })
  githubID: number | null;

  @ApiProperty({
    example: 'NestMaster@gmail.com',
    description: '이메일',
  })
  @Column('varchar', { name: 'email', length: 30, default: '' })
  email: string | null;

  @ApiProperty({
    example: 'NestMaster',
    description: '닉네임',
  })
  @Column('varchar', { name: 'nickname', length: 30, default: '' })
  nickname: string | null;

  @ApiProperty({
    example: 'NestMaster',
    description: 'loginID',
    required: true,
  })
  @Column('varchar', { name: 'loginID', length: 30 })
  loginID: string;

  @ApiProperty({
    example: 'http://blog.com',
    description: 'blog url',
  })
  @Column('varchar', { name: 'blog', length: 200, default: '' })
  blog: string | null;

  @ApiProperty({
    example: '웹 개발자 입니다.',
    description: '자기소개',
  })
  @Column('varchar', { name: 'bio', length: 200, default: '' })
  bio: string | null;

  @ApiProperty({
    example: '',
    description: '프로필 사진 url',
  })
  @Column('varchar', { name: 'avatarUrl', length: 200, default: '' })
  avatarUrl: string | null;

  @ApiProperty({
    example: '',
    description: 'Github url',
  })
  @Column('varchar', { name: 'githubPageUrl', length: 200, default: '' })
  githubPageUrl: string | null;

  // @Column('varchar', { name: 'password', length: 100, select: false })
  @Column('varchar', { name: 'password', length: 100 })
  password: string;

  @ApiProperty({
    example: 'Front-End',
    description: '개발 포지션 타입',
    type: 'enum',
    enum: DeveloperPositionType,
    required: true,
  })
  @Column({
    type: 'enum',
    enum: DeveloperPositionType,
  })
  positionType: DeveloperPositionType;

  @ApiProperty({
    example: 'github',
    description: '로그인 type',
    type: 'enum',
    enum: loginType,
  })
  @Column({
    type: 'enum',
    enum: loginType,
    default: loginType.Local,
  })
  loginType: loginType;

  @ApiProperty({
    required: true,
    example: 'user',
    description: 'user의 권한',
    type: 'enum',
    enum: UserRole,
  })
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.User,
  })
  role: UserRole;

  @ApiProperty({
    example: '2021-05-22T10:19:06.991Z',
    description: '가입 일자',
    required: true,
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    example: '2021-05-22T10:19:06.991Z',
    description: '수정 일자',
    required: true,
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    example: null,
    description: '탈퇴 일자',
    required: true,
  })
  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToMany(() => BlogPosts, (blogposts) => blogposts.User)
  Posts: BlogPosts[];

  @OneToMany(() => BlogPostsLike, (likeDislike) => likeDislike.User)
  LikeDisLike: BlogPostsLike[];

  @ApiProperty()
  @OneToMany(
    () => BlogPostsComment,
    (blogPostsComment) => blogPostsComment.User,
  )
  Comments: BlogPostsComment[];
}

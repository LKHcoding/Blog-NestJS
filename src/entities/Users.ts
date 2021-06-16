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
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ type: 'int', name: 'githubID', default: null })
  githubID: number | null;

  @Column('varchar', { name: 'email', length: 30, default: '' })
  email: string | null;

  @Column('varchar', { name: 'nickname', length: 30, default: '' })
  nickname: string | null;

  @Column('varchar', { name: 'loginID', length: 30 })
  loginID: string;

  @Column('varchar', { name: 'blog', length: 200, default: '' })
  blog: string | null;

  @Column('varchar', { name: 'bio', length: 200, default: '' })
  bio: string | null;

  @Column('varchar', { name: 'avatarUrl', length: 200, default: '' })
  avatarUrl: string | null;

  @Column('varchar', { name: 'githubPageUrl', length: 200, default: '' })
  githubPageUrl: string | null;

  // @Column('varchar', { name: 'password', length: 100, select: false })
  @Column('varchar', { name: 'password', length: 100 })
  password: string;

  @Column({
    type: 'enum',
    enum: DeveloperPositionType,
  })
  positionType: DeveloperPositionType;

  @Column({
    type: 'enum',
    enum: loginType,
    default: loginType.Local,
  })
  loginType: loginType;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.User,
  })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToMany(() => BlogPosts, (blogposts) => blogposts.User)
  Posts: BlogPosts[];
}

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { BlogPosts } from './blog-posts';
import { Users } from './Users';

// 필요한  enum type같은건 각 entity별로 안에서 불러오자.
// 밖에서 땡겨 썼다가 enum에 쿼리 안들어가서 헤맸음.
export enum ActionType {
  Like = 'like',
  DisLike = 'DisLike',
}

@Entity({ schema: 'nesttest', name: 'blog-posts-likeDislike' })
export class BlogPostsLikeDislike {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({
    type: 'enum',
    enum: ActionType,
  })
  actionType: ActionType;

  @Index()
  @Column('int', { name: 'PostId', nullable: false })
  PostId: number;

  @ManyToOne(() => BlogPosts, (blogPosts) => blogPosts.id)
  @JoinColumn([{ name: 'PostId', referencedColumnName: 'id' }])
  BlogPost: BlogPosts;

  @Index()
  @Column('int', { name: 'UserId', nullable: false })
  UserId: number;

  @ManyToOne(() => Users, (users) => users.id)
  @JoinColumn([{ name: 'UserId', referencedColumnName: 'id' }])
  User: Users;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}

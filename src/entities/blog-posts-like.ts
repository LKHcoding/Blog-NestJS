import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BlogPosts } from './blog-posts';
import { Users } from './Users';
import { ApiProperty } from '@nestjs/swagger';

// 필요한  enum type같은건 각 entity별로 안에서 불러오자.
// 밖에서 땡겨 썼다가 enum에 쿼리 안들어가서 헤맸음.
// 아니면 @ApiExtraModels 알아볼것
export enum ActionType {
  Like = 'Like',
  DisLike = 'DisLike',
}

@Entity({ schema: 'nesttest', name: 'blog-posts-like' })
export class BlogPostsLike {
  @ApiProperty()
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @ApiProperty({
    type: 'enum',
    enum: ActionType,
  })
  @Column({
    type: 'enum',
    enum: ActionType,
  })
  actionType: ActionType;

  @ApiProperty()
  @Index()
  @Column('int', { name: 'PostId', nullable: false })
  PostId: number;

  @ApiProperty({ type: () => BlogPosts })
  @ManyToOne(() => BlogPosts, (blogPosts) => blogPosts.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'PostId', referencedColumnName: 'id' }])
  BlogPost: BlogPosts;

  @ApiProperty()
  @Index()
  @Column('int', { name: 'UserId', nullable: false })
  UserId: number;

  @ApiProperty({ type: () => Users })
  @ManyToOne(() => Users, (users) => users.id)
  @JoinColumn([{ name: 'UserId', referencedColumnName: 'id' }])
  User: Users;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ nullable: true })
  @DeleteDateColumn()
  deletedAt: Date | null;
}

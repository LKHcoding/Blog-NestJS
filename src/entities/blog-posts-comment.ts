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

@Entity({ schema: 'nesttest', name: 'blog-posts-comment' })
export class BlogPostsComment {
  @ApiProperty()
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @ApiProperty()
  @Index()
  @Column('int', { name: 'ParentCommentId', nullable: true })
  ParentCommentId: number | null;

  @ApiProperty()
  @Index()
  @Column('int', { name: 'PostId', nullable: false })
  PostId: number;

  @ApiProperty()
  @ManyToOne(() => BlogPosts, (blogPosts) => blogPosts.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'PostId', referencedColumnName: 'id' }])
  BlogPost: BlogPosts;

  @ApiProperty()
  // content 는 MarkDown 형식의 내용이 들어가기때문에
  // utf8mb4_unicode_ci 형식이 되어야한다.
  // 근데 typeorm으로 자동으로 처리되지 않을 수 있으니 안되는경우 직접 디비에 설정할것
  @Column({
    type: 'text',
    name: 'content',
    // length: 3500,
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
  })
  content: string;

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

  @ApiProperty()
  @DeleteDateColumn()
  deletedAt: Date | null;
}

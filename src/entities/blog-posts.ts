import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BlogPostsLike } from './blog-posts-like';
import { BlogPostsTags } from './blog-posts-tags';
import { Users } from './Users';
import { ApiProperty } from '@nestjs/swagger';
import { BlogPostsComment } from './blog-posts-comment';

@Index('UserId', ['UserId'], {})
@Entity({ schema: 'nesttest', name: 'blog-posts' })
export class BlogPosts {
  @ApiProperty()
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @ApiProperty()
  @Column('varchar', { name: 'title', length: 100 })
  title: string;

  @ApiProperty({ type: () => BlogPostsTags })
  @ManyToMany(() => BlogPostsTags, (blogPostsTags) => blogPostsTags.BlogPosts)
  @JoinTable()
  Tags: BlogPostsTags[];

  @ApiProperty({ type: () => [BlogPostsComment] })
  @OneToMany(
    () => BlogPostsComment,
    (blogPostsComments) => blogPostsComments.BlogPost,
  )
  Comments: BlogPostsComment[];

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
  @Column('varchar', { name: 'thumbnail', length: 200 })
  thumbnail: string;

  @ApiProperty()
  @Column('int', { name: 'UserId', nullable: false })
  UserId: number;

  @ApiProperty({ type: () => Users })
  @ManyToOne(() => Users, (users) => users.id)
  @JoinColumn([{ name: 'UserId', referencedColumnName: 'id' }])
  User: Users;

  @ApiProperty()
  @OneToMany(() => BlogPostsLike, (likeDislike) => likeDislike.BlogPost)
  LikeDisLike: BlogPostsLike;

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

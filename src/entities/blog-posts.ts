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

@Index('UserId', ['UserId'], {})
@Entity({ schema: 'nesttest', name: 'blog-posts' })
export class BlogPosts {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'title', length: 50 })
  title: string;

  @ManyToMany(() => BlogPostsTags, (blogPostsTags) => blogPostsTags.BlogPosts)
  @JoinTable()
  Tags: BlogPostsTags[];

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

  @Column('varchar', { name: 'thumbnail', length: 100 })
  thumbnail: string;

  @Column('int', { name: 'UserId', nullable: false })
  UserId: number;

  @ManyToOne(() => Users, (users) => users.id)
  @JoinColumn([{ name: 'UserId', referencedColumnName: 'id' }])
  User: Users;

  @OneToMany(() => BlogPostsLike, (likeDislike) => likeDislike.BlogPost)
  LikeDisLike: BlogPostsLike;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}

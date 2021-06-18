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
import { BlogPostsTags } from './blog-posts-tags';
import { Users } from './Users';

@Index('UserId', ['UserId'], {})
@Entity({ schema: 'nesttest', name: 'blog-posts' })
export class BlogPosts {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'title', length: 50 })
  title: string;

  // @Column('simple-array', { name: 'tags' })
  // tags: string[];

  @ManyToMany(() => BlogPostsTags, (blogPostsTags) => blogPostsTags.BlogPosts)
  @JoinTable()
  Tags: BlogPostsTags[];

  @Column('varchar', { name: 'content', length: 1500 })
  content: string;

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

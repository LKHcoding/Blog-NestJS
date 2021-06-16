import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { BlogPosts } from './blog-posts';

// 필요한  enum type같은건 각 entity별로 안에서 불러오자.
// 밖에서 땡겨 썼다가 enum에 쿼리 안들어가서 헤맸음.
export enum DeveloperPositionType {
  FrontEnd = 'Front-End',
  BackEnd = 'Back-End',
  FullStack = 'Full-Stack',
}

@Unique(['tagName', 'positionType'])
@Entity({ schema: 'nesttest', name: 'blog-posts-tags' })
export class BlogPostsTags {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'tagName', length: 20 })
  tagName: string;

  @Column({
    type: 'enum',
    enum: DeveloperPositionType,
  })
  positionType: DeveloperPositionType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { BlogPosts } from './blog-posts';
import { ApiProperty } from '@nestjs/swagger';

// 필요한  enum type같은건 각 entity별로 안에서 불러오자.
// 밖에서 땡겨 썼다가 enum에 쿼리 안들어가서 헤맸음.
// 아니면 @ApiExtraModels 알아볼것
export enum DeveloperPositionType {
  FrontEnd = 'Front-End',
  BackEnd = 'Back-End',
  FullStack = 'Full-Stack',
}

@Unique(['tagName', 'positionType'])
@Entity({ schema: 'nesttest', name: 'blog-posts-tags' })
export class BlogPostsTags {
  @ApiProperty()
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @ApiProperty()
  @Column('varchar', { name: 'tagName', length: 20 })
  tagName: string;

  @ApiProperty({
    type: 'enum',
    enum: DeveloperPositionType,
  })
  @Column({
    type: 'enum',
    enum: DeveloperPositionType,
  })
  positionType: DeveloperPositionType;

  @ApiProperty({
    type: () => BlogPosts,
    isArray: true,
  })
  @ManyToMany(() => BlogPosts, (blogPosts) => blogPosts.Tags)
  BlogPosts: BlogPosts[];

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ type: String, nullable: true })
  @DeleteDateColumn()
  deletedAt: Date | null;
}

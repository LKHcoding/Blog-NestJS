import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BlogPosts } from './BlogPosts';
import { DeveloperPositionType } from './Users';

@Entity({ schema: 'nesttest', name: 'blogPostsTags' })
export class BlogPostsTags {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'tagName', length: 20 })
  tagName: string;

  @Column({
    type: 'enum',
    enum: DeveloperPositionType,
    enumName: 'positionType',
  })
  positionType: DeveloperPositionType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}

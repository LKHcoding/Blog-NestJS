import { PartialType } from '@nestjs/swagger';
import { CreateBlogPostDto } from './create-blog-post.dto';

export class UpdateBlogDto extends PartialType(CreateBlogPostDto) {}

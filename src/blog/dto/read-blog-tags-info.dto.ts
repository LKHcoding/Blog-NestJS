import { BlogPostsTags } from 'src/entities/blog-posts-tags';
import { ApiProperty } from '@nestjs/swagger';

export class TagInfoResponseDto {
  @ApiProperty({
    type: () => BlogPostsTags,
    isArray: true,
  })
  public tagInfoResult: BlogPostsTags[];

  @ApiProperty()
  public allPostCount: number;
}

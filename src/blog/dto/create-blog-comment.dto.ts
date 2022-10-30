import { IsNumber, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from '../../common/decorators/is-optional.decorator';

export class CreateBlogCommentDto {
  @ApiProperty({
    example: '140',
    description: 'postId',
    required: true,
  })
  @IsNumber()
  postId: number;

  @ApiProperty({
    example: '0',
    description: 'parentCommentId',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  parentCommentId?: number;

  @ApiProperty({
    example: '댓글 내용 댓글 내용 123123',
    description: 'content',
    required: true,
  })
  @MaxLength(65535)
  @IsString()
  content: string;
}

import { IsArray, IsNumber, IsString, MaxLength } from 'class-validator';

export class UpdateBlogPostDto {
  @IsNumber()
  id: number;

  @IsString()
  @MaxLength(100)
  title: string;

  @IsArray()
  tags: string[];

  @MaxLength(65535)
  @IsString()
  content: string;

  @IsString()
  thumbnail: string;

  @IsString()
  prevThumbnail: string;
}

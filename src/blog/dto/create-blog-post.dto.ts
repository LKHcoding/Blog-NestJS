import { IsArray, IsString, MaxLength } from 'class-validator';

export class CreateBlogPostDto {
  @IsString()
  @MaxLength(30)
  title: string;

  @IsArray()
  tags: string[];

  @MaxLength(1500)
  @IsString()
  content: string;

  @IsString()
  thumbnail: string;
}

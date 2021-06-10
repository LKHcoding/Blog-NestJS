import { IsNumber, IsString } from 'class-validator';

export class GithubUserInfoDTO {
  @IsNumber()
  githubID: number;
  @IsString()
  nodeID: string;
  @IsString()
  loginID: string;
  @IsString()
  email: string;
  @IsString()
  name: string;
  @IsString()
  blog: string;
  @IsString()
  bio: string;
  @IsString()
  avatarUrl: string;
  @IsString()
  githubPageUrl: string;
}

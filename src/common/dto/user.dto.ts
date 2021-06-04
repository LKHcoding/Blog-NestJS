import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, IsEmail, IsString, MaxLength } from 'class-validator';
import { loginType, UserRole } from 'src/entities/Users';

export class UserDto {
  @ApiProperty({
    required: true,
    example: '1',
    description: 'Primary key ID',
  })
  public id: number;

  @ApiProperty({
    example: 'NestMaster',
    description: 'githubID',
  })
  @IsAlphanumeric()
  @MaxLength(10)
  public githubID: number | null;

  @ApiProperty({
    example: 'NestMaster@gmail.com',
    description: '이메일',
  })
  @IsEmail()
  public email: string | null;

  @ApiProperty({
    example: 'NestMaster',
    description: '닉네임',
  })
  @IsAlphanumeric()
  @MaxLength(10)
  public nickname: string | null;

  @ApiProperty({
    example: 'NestMaster',
    description: 'loginID',
    required: true,
  })
  @IsAlphanumeric()
  @MaxLength(10)
  public loginID: string;

  @ApiProperty({
    example: 'http://blog.com',
    description: 'blog url',
  })
  @IsAlphanumeric()
  @MaxLength(150)
  public blog: string | null;

  @ApiProperty({
    example: '웹 개발자 입니다.',
    description: '자기소개',
  })
  @IsAlphanumeric()
  @MaxLength(150)
  public bio: string | null;

  @ApiProperty({
    example: '',
    description: '프로필 사진 url',
  })
  @IsAlphanumeric()
  @MaxLength(150)
  public avatarUrl: string | null;

  @ApiProperty({
    example: '',
    description: 'Github url',
  })
  @IsAlphanumeric()
  @MaxLength(150)
  public githubPageUrl: string | null;

  @ApiProperty({
    example: 'github',
    description: '로그인 type',
    type: 'enum',
    enum: loginType,
  })
  public loginType: loginType;

  @ApiProperty({
    example: 'user',
    description: 'user의 권한',
    type: 'enum',
    enum: UserRole,
  })
  public role: UserRole;

  @ApiProperty({
    example: '2021-05-22T10:19:06.991Z',
    description: '가입 일자',
    required: true,
  })
  public createdAt: string;

  @ApiProperty({
    example: '2021-05-22T10:19:06.991Z',
    description: '수정 일자',
    required: true,
  })
  public updatedAt: string;

  @ApiProperty({
    example: null,
    description: '탈퇴 일자',
    required: true,
  })
  public deletedAt: string | null;
}

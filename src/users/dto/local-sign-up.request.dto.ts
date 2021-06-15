import { ApiProperty, OmitType } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { DeveloperPositionType, Users } from 'src/entities/Users';

export class LocalSignUpRequestDto {
  @ApiProperty({
    example: 'NestMaster@gmail.com',
    description: '이메일',
    required: true,
  })
  @MaxLength(30)
  @IsEmail()
  public email: string;

  @ApiProperty({
    example: 'NestMaster',
    description: 'loginID',
    required: true,
  })
  @IsAlphanumeric()
  @MaxLength(30)
  public loginID: string;

  @ApiProperty({
    example: 'NestMaster',
    description: 'nickname',
    required: true,
  })
  @IsAlphanumeric()
  @MaxLength(30)
  public nickname: string;

  @ApiProperty({
    example: 'http://blog.com',
    description: 'blog url',
  })
  @IsString()
  @MaxLength(200)
  public blog: string | null;

  @ApiProperty({
    example: '웹 개발자 입니다.',
    description: '자기소개',
  })
  @IsString()
  @MaxLength(200)
  public bio: string | null;

  @ApiProperty({
    example: 'password123',
    description: '비밀번호(5~30자)',
    required: true,
  })
  @MinLength(5)
  @MaxLength(30)
  public password: string;

  @ApiProperty({
    example: 'Front-End',
    description: '개발 포지션 타입',
    required: true,
  })
  @IsString()
  public positionType: DeveloperPositionType;
}

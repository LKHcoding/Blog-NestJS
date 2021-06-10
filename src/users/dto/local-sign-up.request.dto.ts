import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, IsEmail, MaxLength, MinLength } from 'class-validator';
import { DeveloperPositionType } from 'src/entities/Users';

export class LocalSignUpRequestDto {
  @ApiProperty({
    example: 'NestMaster@gmail.com',
    description: '이메일',
    required: true,
  })
  @IsEmail()
  public email: string;

  @ApiProperty({
    example: 'NestMaster',
    description: 'loginID',
    required: true,
  })
  @IsAlphanumeric()
  @MaxLength(10)
  public loginID: string;

  @ApiProperty({
    example: 'NestMaster',
    description: 'nickname',
    required: true,
  })
  @IsAlphanumeric()
  @MaxLength(10)
  public nickname: string;

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
    example: 'password123',
    description: '비밀번호(5~30자)',
    required: true,
  })
  @MinLength(5)
  @MaxLength(30)
  public password: string;

  @ApiProperty({
    example: 'FrontEnd',
    description: '개발 포지션 타입',
    required: true,
  })
  public positionType: DeveloperPositionType;
}

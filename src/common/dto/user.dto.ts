import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, IsEmail, MaxLength } from 'class-validator';

export class UserDto {
  @ApiProperty({
    required: true,
    example: '1',
    description: '아이디',
  })
  public id: number;

  @ApiProperty({
    example: 'NestMaster@gmail.com',
    description: '이메일',
    required: true,
  })
  @IsEmail()
  public email: string;

  @ApiProperty({
    example: 'NestMaster',
    description: '닉네임',
    required: true,
  })
  @IsAlphanumeric()
  @MaxLength(10)
  public nickname: string;

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
  public deletedAt: string;
}

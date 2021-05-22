import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, IsEmail, MaxLength } from 'class-validator';

export class JoinRequestDto {
  @ApiProperty({
    example: 'NestMaster@gmail.com',
    description: '이메일',
    required: true,
  })
  @IsEmail()
  public email: string;

  @ApiProperty({
    example: 'NestMaster',
    description: 'nickname',
    required: true,
  })
  @IsAlphanumeric()
  @MaxLength(10)
  public nickname: string;

  @ApiProperty({
    example: 'password123',
    description: '비밀번호',
    required: true,
  })
  @MaxLength(30)
  public password: string;
}

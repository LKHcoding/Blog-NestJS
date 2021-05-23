import { ApiHeader, ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, IsEmail, MaxLength } from 'class-validator';

@ApiHeader({ name: 'test' })
export class AuthLoginRequestDto {
  @ApiProperty({
    example: 'test4@gmail.com',
    description: '이메일',
    required: true,
  })
  @IsEmail()
  public email: string;

  @ApiProperty({
    example: 'test4',
    description: '비밀번호',
    required: true,
  })
  @IsAlphanumeric()
  @MaxLength(30)
  public password: string;
}

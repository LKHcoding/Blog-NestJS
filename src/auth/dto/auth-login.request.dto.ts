import { ApiHeader, ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, IsEmail, MaxLength, MinLength } from 'class-validator';

@ApiHeader({ name: 'test' })
export class AuthLoginRequestDto {
  @ApiProperty({
    example: 'NestMaster',
    description: 'loginID',
    required: true,
  })
  @IsAlphanumeric()
  @MaxLength(10)
  public loginID: string;

  @ApiProperty({
    example: 'password123',
    description: '비밀번호(5~30자)',
    required: true,
  })
  @MinLength(5)
  @MaxLength(30)
  public password: string;
}

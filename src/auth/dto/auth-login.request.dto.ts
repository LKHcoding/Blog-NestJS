import { ApiHeader, ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from 'class-validator';

@ApiHeader({ name: 'test' })
export class AuthLoginRequestDto {
  @ApiProperty({
    example: 'test4',
    description: 'loginID',
    required: true,
  })
  @IsAlphanumeric()
  @IsNotEmpty()
  @MaxLength(10)
  public loginID: string;

  @ApiProperty({
    example: 'test4',
    description: '비밀번호(5~30자)',
    required: true,
  })
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(30)
  public password: string;
}

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
  @MinLength(5, { message: 'ID는 최소 5자 이상을 입력해주세요.' })
  @MaxLength(15, { message: 'ID는 최대 15자 이내로 입력해주세요.' })
  public loginID: string;

  @ApiProperty({
    example: 'test4',
    description: '비밀번호(5~30자)',
    required: true,
  })
  @IsNotEmpty()
  @MinLength(5, { message: '비밀번호는 최소 5자 이상을 입력해주세요.' })
  @MaxLength(30, { message: '비밀번호는 최대 30자 이내로 입력해주세요.' })
  public password: string;
}

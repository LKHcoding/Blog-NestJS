import { ApiProperty } from '@nestjs/swagger';

export class JoinRequestDto {
  @ApiProperty({
    example: 'NestMaster@gmail.com',
    description: '이메일',
    required: true,
  })
  public email: string;

  @ApiProperty({
    example: 'NestMaster',
    description: 'nickname',
    required: true,
  })
  public nickname: string;

  @ApiProperty({
    example: 'password123',
    description: '비밀번호',
    required: true,
  })
  public password: string;
}

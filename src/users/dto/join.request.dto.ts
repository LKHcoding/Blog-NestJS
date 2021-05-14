import { ApiProperty } from '@nestjs/swagger';

export class JoinRequestDto {
  @ApiProperty({
    example: 'LKHcoding@gmail.com',
    description: '이메일',
    required: true,
  })
  public email: string;

  @ApiProperty({
    example: 'LKHcoding',
    description: 'LKH',
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

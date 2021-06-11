import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GithubCodeDto {
  @ApiProperty({
    example: 'random token code string',
    description: 'Github code',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly code: string;
}

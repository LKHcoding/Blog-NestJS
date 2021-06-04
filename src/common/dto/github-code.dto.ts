import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GithubCodeDto {
  @ApiProperty({
    required: true,
    example: 'random token code string',
    description: 'Github code',
  })
  @IsString()
  readonly code: string;
}

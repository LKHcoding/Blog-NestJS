import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { DeveloperPositionType } from 'src/entities/Users';
import { UserDto } from './user.dto';

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

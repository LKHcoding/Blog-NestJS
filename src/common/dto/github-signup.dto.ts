import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDefined,
  IsEnum,
  IsNotEmptyObject,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { DeveloperPositionType } from 'src/entities/Users';
import { GithubUserInfoDTO } from './github-user-info.dto';

export class GithubSignUpDto {
  @ApiProperty({
    example: 'github User data',
    description: 'github User Data Type',
  })
  @IsObject({
    message: 'github User 타입이 맞지 않습니다.',
  })
  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested({ each: true })
  @Type(() => GithubUserInfoDTO)
  public githubUserInfo: GithubUserInfoDTO;

  @ApiProperty({
    example: 'Front-End',
    description: '개발자 포지션 타입',
    type: 'enum',
    enum: DeveloperPositionType,
    required: true,
  })
  @IsEnum(DeveloperPositionType)
  public positionType: DeveloperPositionType;
}

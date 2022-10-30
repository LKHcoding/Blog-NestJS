import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsAlphanumeric, IsEmail, MaxLength } from 'class-validator';
import {
  DeveloperPositionType,
  loginType,
  UserRole,
  Users,
} from 'src/entities/Users';

export class UserDto extends PickType(Users, [
  'id',
  'githubID',
  'email',
  'nickname',
  'loginID',
  'blog',
  'bio',
  'avatarUrl',
  'githubPageUrl',
  'positionType',
  'loginType',
  'role',
] as const) {
  public id: number;

  @IsAlphanumeric()
  @MaxLength(10)
  public githubID: number | null;

  @IsEmail()
  public email: string | null;

  @IsAlphanumeric()
  @MaxLength(10)
  public nickname: string | null;

  @IsAlphanumeric()
  @MaxLength(10)
  public loginID: string;

  @IsAlphanumeric()
  @MaxLength(150)
  public blog: string | null;

  @IsAlphanumeric()
  @MaxLength(150)
  public bio: string | null;

  @IsAlphanumeric()
  @MaxLength(150)
  public avatarUrl: string | null;

  @IsAlphanumeric()
  @MaxLength(150)
  public githubPageUrl: string | null;

  public positionType: DeveloperPositionType;

  public loginType: loginType;

  public role: UserRole;

  public createdAt: string;

  public updatedAt: string;

  public deletedAt: string | null;
}

import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/common/decorators/role.decorator';
import { UserRole } from 'src/entities/Users';

@Injectable()
export class RolesGuard implements CanActivate {
  // 아래와 같은 설정을 통해 토큰을 가져올 경우와 @Public이 붙은 곳의 경로는 공개 경로로 설정.
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // console.log(requiredRoles);

    if (!requiredRoles) {
      // role이 필요없는 resource면 그냥 넘어감
      // @Auth를 하지 않은곳은 로그인이 필요없는곳이므로
      // 인증자체가 없음
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    // console.log(user.role);
    if (!user) {
      // jwtAuthGuard에서 인증후에 user정보를 request에 넘겨준다.
      // user정보가 없으면 안됨.
      // return false;
      throw new HttpException(
        'User 데이터가 없습니다.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (user.role === UserRole.Admin) {
      //관리자 권한을 가진 계정은 @Auth(여기에 안써줘도) 모두 통과시킴
      return true;
    }

    // controller 위에 @Auth에 적어놓은 권한들만 들어올수있음(ex: @Auth(UserRole.Admin) 하면 어드민만 들어올 수 있는 곳)
    if (requiredRoles.includes(user.role)) {
      // 사용자의 role이 resource가 필요한 권한에 포함되어있는지 검사!
      return true;
    } else {
      throw new HttpException('권한이 없습니다.', HttpStatus.UNAUTHORIZED);
    }

    // return requiredRoles.includes(user.role); // 사용자의 role이 resource가 필요한 권한에 포함되어있는지 검사!
  }
}

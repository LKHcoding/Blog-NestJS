import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ROLES_KEY } from 'src/common/decorators/role.decorator';
import { UserRole } from 'src/entities/Users';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // 아래와 같은 설정을 통해 토큰을 가져올 경우와 @Public이 붙은 곳의 경로는 공개 경로로 설정.
  // constructor(private reflector: Reflector) {
  //   super();
  // }
  // canActivate(context: ExecutionContext) {
  //   const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
  //     ROLES_KEY,
  //     [context.getHandler(), context.getClass()],
  //   );
  //   console.log(requiredRoles);
  //   if (!requiredRoles) {
  //     // role이 필요없는 resource면 그냥 넘어감
  //     return true;
  //   }
  //   const request = context.switchToHttp().getRequest();
  //   const user = request.user;
  //   console.log('this is user : ', user);
  //   if (!user) {
  //     return false;
  //   }
  //   if (requiredRoles.includes(UserRole.User)) {
  //     return true; // User 권한은 로그인된 사용자 중 아무나 접근이 가능하다는 뜻.
  //   }
  //   return requiredRoles.includes(user.role); // 사용자의 role이 resource가 필요한 권한에 포함되어있는지 검사!
  // }
}

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  // CanActivate를 implements 하였으므로, canActivate 함수를 구현해야 합니다.
  async canActivate(context: ExecutionContext) {
    // 클라이언트에서 보낸 request 정보를 읽어옵니다.
    const request = context.switchToHttp().getRequest();

    return request.isAuthenticated();
  }
}

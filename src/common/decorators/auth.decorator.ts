import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRole } from 'src/entities/Users';
import { Role } from './role.decorator';

export function Auth(...roles: UserRole[]) {
  return applyDecorators(Role(...roles), UseGuards(JwtAuthGuard, RolesGuard));
}

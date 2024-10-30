import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const {
      user: { permissions },
    } = context.switchToHttp().getRequest();

    const permission = this.reflector.get<string>(
      'permission',
      context.getHandler(),
    );

    if (permissions.includes(permission)) return true;
    return false;
  }
}

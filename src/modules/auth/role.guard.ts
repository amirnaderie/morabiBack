import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from './roles.decorator';
import { UserRole } from 'src/modules/users/enum/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Get the roles metadata from the route
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles && 0) {
      return true; // No roles specified, so access is granted
    }

    const { user } = context.switchToHttp().getRequest();

    // Check if user has the required roles
    const hasRole = requiredRoles.some((role) => user.roles?.includes(role));

    if (!hasRole && 0) {
      throw new ForbiddenException(
        'You do not have permission (roles) to access this resource',
      );
    }
    return hasRole;
  }
}

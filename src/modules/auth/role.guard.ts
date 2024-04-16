import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/common/decorators/decorator.common';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.getAllAndOverride<boolean>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    console.log(roles);
    console.log(context.getClass());
    const request = context.switchToHttp().getRequest();
    if (roles) {
      if (roles[0] == request.user.payload.role) {
        return true;
      }
      throw new UnauthorizedException();
    }
    return true;
  }
}

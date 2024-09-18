import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/common/decorators/decorator.common';
import { UserService } from '../user/user.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector, private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);
    const request = context.switchToHttp().getRequest();

    if (roles && roles.length) {
      if (!request.user) {
        return false;
      }
      const roleOfUser = await this.userService.findRoleOfUserById(request.user.sub);
      if (roles.some((role) => role === roleOfUser.name)) {
        return true;
      }
      return false;
    }
    return true;
  }
}

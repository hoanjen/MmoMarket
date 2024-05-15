import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { SetMetadata } from '@nestjs/common';
import { UseInterceptors, applyDecorators } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { ApiBody, ApiConsumes, ApiProperty } from '@nestjs/swagger';


export enum Role {
  User = 'USER',
  Admin = 'ADMIN',
  Kich ='KICK'
}

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
  },
);

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);


export const IS_PUBLIC_KEY = 'isPublic';
export const IsPublic = () => SetMetadata(IS_PUBLIC_KEY, true);



export function ApiFiles(
  fieldName = 'files',
) {
  return applyDecorators(
    UseInterceptors(FilesInterceptor(fieldName)),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          [fieldName]: {
            type: 'array',
            items: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      },
    }),
  );
}
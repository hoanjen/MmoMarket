import { HttpStatus } from '@nestjs/common';
import exp from 'constants';
import { Request } from 'express';

export enum EResponse {
  ERROR = 'error',
  SUCCESS = 'success',
}

export interface IResponseCommon<T = any> {
  statusCode: HttpStatus;
  status?: EResponse;
  data: T;
  message: string[] | string;
}

export interface User {
  sub: string; //user_id
  type: string;
  username: string;
}

export interface RequestAuth extends Request {
  user?: User;
}

import { HttpStatus } from '@nestjs/common';

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

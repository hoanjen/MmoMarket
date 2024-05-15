import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { EResponse } from '../interface.common';


@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: exception['message'] };

    // console.log(exception);
    response.status(status).json({
      message:
        typeof message['message'] === 'string'
          ? [message['message']]
          : message['message'],
      statusCode: status,
      status: EResponse.ERROR,

      ...(status === 500
        ? { path: request.path, timestamp: new Date().toISOString() }
        : {}),
    });
  }
}

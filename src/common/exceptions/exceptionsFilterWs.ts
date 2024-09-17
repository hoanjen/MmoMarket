import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { EResponse } from '../interface.common';

@Catch()
export class WsExceptionFilter implements ExceptionFilter {
  catch(exception: WsException, host: ArgumentsHost) {
    const ctx = host.switchToWs();
    const client = ctx.getClient();
    const data = ctx.getData();
    console.log(1111);
    const message = exception.getError() || 'An unknown error occurred';

    client.emit('exception', {
      status: EResponse.ERROR,
      message: typeof message === 'string' ? [message] : message,
      timestamp: new Date().toISOString(),
    });
  }
}

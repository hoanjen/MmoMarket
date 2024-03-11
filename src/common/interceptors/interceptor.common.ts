import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { ip, method, path } = request;
    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() =>
          console.log(
            `Client ip ${ip} request method :${method} ${path} take ${
              Date.now() - now
            }ms`,
          ),
        ),
      );
  }
}

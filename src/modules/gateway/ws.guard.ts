import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { WsException } from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();
    const token = client.handshake?.query?.token;
    if (!token) {
      throw new WsException('Missing token');
    }
    try {
      const user = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('jwt.jwtSecret'),
      });
      client['user'] = user.payload;
    } catch (error) {
      throw new WsException(`${error.name}`);
    }

    return true;
  }
}

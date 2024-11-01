import { OnModuleInit, UseFilters, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { WsException } from '@nestjs/websockets';
import { WsExceptionFilter } from 'src/common/exceptions/exceptionsFilterWs';
import { WsAuthGuard } from './ws.guard';
import { GatewayService } from './gateway.service';
import { DataChat } from './interface/user-connect.interface';

declare module 'socket.io' {
  interface Socket {
    user: {
      sub: string;
      type: string;
      username: string;
    };
  }
}

@UseFilters(new WsExceptionFilter())
@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: '*',
  },
})
export class Gateway implements OnModuleInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly gatewayService: GatewayService,
  ) {}

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log('Socket connected:', socket.id);
    });
  }

  async handleConnection(client: Socket, ...args: any[]) {
    try {
      console.log('11111111111111111');
      const token = Array.isArray(client.handshake.query.token)
        ? client.handshake.query.token[0]
        : client.handshake.query.token;
      if (!token) {
        throw new WsException('Missing token');
      }

      const user = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('jwt.jwtSecret'),
      });
      await this.gatewayService.addSocketId(user.payload.sub, client.id);
      console.log('User connected:', user.payload.sub);
    } catch (error) {
      console.log(error);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    try {
      const token = Array.isArray(client.handshake.query.token)
        ? client.handshake.query.token[0]
        : client.handshake.query.token;
      if (!token) {
        throw new WsException('Missing token');
      }

      const user = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('jwt.jwtSecret'),
      });

      console.log('User disconnected:', user.payload.sub);
      await this.gatewayService.removeSocketId(user.payload.sub, client.id);
      client.disconnect();
    } catch (error) {
      client.disconnect();
      client.emit('exception', error);
    }
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any): string {
    throw new WsException('aaa');
    return 'Hello world!';
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('event')
  async onNewMessage(@ConnectedSocket() client: Socket, @MessageBody() body: any) {
    console.log('New message from user:', client.user);

    // throw new WsException('Missing token');
  }

  async onMessageUserToUsers(sender_id: string, receiver_id: string) {
    const receiver_socket_id = await this.gatewayService.getSocketIds(receiver_id);
    this.server.to(receiver_socket_id).emit('abc', { sender_id, message: 'abc' });
  }

  async onMessageToUsers(receiver_ids: string[], data: DataChat) {
    const receiver_socket_ids = await this.gatewayService.getAllSocketIds(receiver_ids);
    receiver_socket_ids.forEach((receiver_socket_id) => {
      this.server.to(receiver_socket_id).emit('message', { data });
    });
  }
}

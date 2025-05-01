import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;
  // private readonly configService = new ConfigService();
  async connectToRedis(): Promise<void> {
    const pubClient = createClient({
      // url: 'redis://default:AQfUyeLMGhaUIscvM5UB8V9JXRNQONEq@redis-19443.c252.ap-southeast-1-1.ec2.redns.redis-cloud.com:19443',
      // url: 'redis://localhost:6379',
      url: process.env.REDIS_URL ?? 'redis://localhost:6379',
    });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);

    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);
    return server;
  }
}

import { Injectable } from '@nestjs/common';
import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GatewayService {
  // private readonly configService = new ConfigService();
  private readonly redisClient = createClient({
    url: process.env.REDIS_URL ?? 'redis://localhost:6379',
    // url: 'redis://localhost:6379',
  });
  constructor() {
    this.redisClient.connect();
  }

  async addSocketId(user_id: string, socket_id: string) {
    await this.redisClient.sAdd(`user:${user_id}:socket_ids`, socket_id);
  }

  async getSocketIds(user_id: string): Promise<string[]> {
    return await this.redisClient.sMembers(`user:${user_id}:socket_ids`);
  }

  async removeSocketId(user_id: string, socket_id: string) {
    await this.redisClient.sRem(`user:${user_id}:socket_ids`, socket_id);
  }

  async removeAllSocketIds(user_id: string) {
    await this.redisClient.del(`user:${user_id}:socket_ids`);
  }
  async getAllSocketIds(user_ids: string[]): Promise<string[]> {
    const pipeline = this.redisClient.multi();

    user_ids.forEach((user_id) => {
      pipeline.sMembers(`user:${user_id}:socket_ids`);
    });

    const results: any[] = await pipeline.exec();
    const allSocketIds: string[] = [...results[0]];

    return allSocketIds;
  }

  async onModuleDestroy() {
    await this.redisClient.disconnect();
  }
}

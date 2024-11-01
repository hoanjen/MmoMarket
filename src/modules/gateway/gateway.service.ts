import { Injectable } from '@nestjs/common';
import { createClient } from 'redis';

@Injectable()
export class GatewayService {
  private readonly redisClient = createClient({
    url: 'redis://default:AQfUyeLMGhaUIscvM5UB8V9JXRNQONEq@redis-19443.c252.ap-southeast-1-1.ec2.redns.redis-cloud.com:19443',
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

    const results = await pipeline.exec();

    const allSocketIds: string[] = [];
    results.forEach((result) => {
      if (result[1]) {
        allSocketIds.push(...result[1]);
      }
    });

    return allSocketIds;
  }

  async onModuleDestroy() {
    await this.redisClient.disconnect();
  }
}

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

  async getSocketId(user_id: string) {
    return this.redisClient.hGet('user_socket_ids', user_id);
  }

  async setSocketId(user_id: string, socket_id: string) {
    return this.redisClient.hSet('user_socket_ids', user_id, socket_id);
  }

  async delSocketId(user_id: string) {
    return this.redisClient.hDel('user_socket_ids', user_id);
  }

  async getSocketIds(user_ids: string[]) {
    return this.redisClient.hmGet('user_socket_ids', user_ids);
  }
}

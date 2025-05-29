import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { RedisCacheService } from './redis-cache.service';

@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      url: process.env.REDIS_URL ?? 'redis://localhost:6379',
      ttl: 600,
    }),
  ],
  providers: [RedisCacheService],
  exports: [RedisCacheService],
})
export class RedisCacheModule {}

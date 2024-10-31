import { Module } from '@nestjs/common';
import { Gateway } from './app.gateway';

import { GatewayService } from './gateway.service';

@Module({
  providers: [GatewayService, Gateway],
  exports: [GatewayService, Gateway],
})
export class GatewayModule {}

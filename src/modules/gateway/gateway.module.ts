import { Module } from '@nestjs/common';
import { Gateway } from './app.gateway';
import { APP_GUARD } from '@nestjs/core';
import { WsAuthGuard } from './ws.guard';
import { GatewayService } from './gateway.service';

@Module({
  providers: [GatewayService, Gateway],
  exports: [GatewayService, Gateway]
})
export class GatewayModule { }

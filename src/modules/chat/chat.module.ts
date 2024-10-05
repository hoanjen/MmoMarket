import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './entity/group.entity';
import { Message } from './entity/message.entity';
import { Member } from './entity/member.entity';
import { UserModule } from '../user/user.module';
import { GatewayModule } from '../gateway/gateway.module';

@Module({
  imports: [TypeOrmModule.forFeature([Group, Message, Member]), UserModule, GatewayModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}

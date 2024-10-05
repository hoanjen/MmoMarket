import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateMessageDto, JoinSingleChatDto } from './dtos/create-message.dto';
import { RequestAuth } from 'src/common/interface.common';
import { ChatService } from './chat.service';
import { GetMessageQueryDto } from './dtos/get-message.dto';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Join Chat' })
  @Post('/joinchat')
  async joinSingleChat(@Body() joinSingleChatInput: JoinSingleChatDto, @Req() req: RequestAuth) {
    return this.chatService.joinSingleChat(joinSingleChatInput, req);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Chat' })
  @Post()
  async chat(@Body() createMessageInput: CreateMessageDto, @Req() req: RequestAuth) {
    return this.chatService.chat(createMessageInput, req);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get message' })
  @Get()
  async getMessage(@Query() getMessageQueryDtoInput: GetMessageQueryDto, @Req() req: RequestAuth) {
    return this.chatService.getAllMessageByToken(getMessageQueryDtoInput, req);
  }
}

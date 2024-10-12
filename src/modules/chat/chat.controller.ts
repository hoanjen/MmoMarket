import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateMessageDto, JoinSingleChatDto } from './dtos/create-message.dto';
import { RequestAuth } from 'src/common/interface.common';
import { ChatService } from './chat.service';
import { GetMessageByGroupIdDto, GetSideBarChatQueryDto } from './dtos/get-message.dto';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Join Single Chat' })
  @Post('/joinsinglechat')
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
  @ApiOperation({ summary: 'Get SideBar Chat' })
  @Get('/sidebar-chat')
  async getSideBarChat(@Query() getSideBarDtoInput: GetSideBarChatQueryDto, @Req() req: RequestAuth) {
    return this.chatService.getSideBarChatByToken(getSideBarDtoInput, req);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Message By Group Id' })
  @Get('/messages')
  async getMessageByGroupId(@Query() getMessageByGroupIdInput: GetMessageByGroupIdDto, @Req() req: RequestAuth) {
    return this.chatService.getMessageByGroupId(getMessageByGroupIdInput, req);
  }
}

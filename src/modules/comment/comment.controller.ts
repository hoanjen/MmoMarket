import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { GetCommentDto } from './dtos/get-comment.dto';
import { IsPublic } from 'src/common/decorators/decorator.common';

@ApiTags('Comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Comment' })
  @Post()
  async comment(@Body() createCommentInput: CreateCommentDto, @Req() req: any) {
    return this.commentService.createComment(createCommentInput, req.user.sub);
  }

  @IsPublic()
  @ApiOperation({ summary: 'Get comment' })
  @Get()
  async getComment(@Query() getCommentInput: GetCommentDto) {
    return this.commentService.getCommentByProductId(getCommentInput);
  }
}

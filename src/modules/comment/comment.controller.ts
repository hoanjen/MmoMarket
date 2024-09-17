import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dtos/create-comment.dto';

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
}

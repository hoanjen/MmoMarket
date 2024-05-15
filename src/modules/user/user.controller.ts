import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  Put,
  Request,
  UploadedFile,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { UserService } from './user.service';
import { IsPublic, Role, Roles } from 'src/common/decorators/decorator.common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { CreateUserDto } from './dtos/create-user.dto';
import { FindUserByIdDto } from './dtos/find-user-by-id.dto';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @IsPublic()
  @Post()
  @ApiOperation({ summary: 'Create admin' })
  async createUserByAdmin(@Body() createUserInput: CreateUserDto) {
    return await this.userService.createAdminByAdmin(createUserInput);
  }

  @IsPublic()
  @Get('/:id')
  @ApiOperation({ summary: 'Find user by id' })
  async findUserById(@Param() findUserByIdInput: FindUserByIdDto) {
    return await this.userService.findUserById(findUserByIdInput);
  }

  
}

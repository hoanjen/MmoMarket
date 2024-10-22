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
import { Gateway } from '../gateway/app.gateway';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService, private readonly gateway: Gateway) {}

  @IsPublic()
  @Post()
  @ApiOperation({ summary: 'Create admin' })
  async createUserByAdmin(@Body() createUserInput: CreateUserDto) {
    return await this.userService.createAdminByAdmin(createUserInput);
  }

  @IsPublic()
  @Get('/get-by')
  @ApiOperation({ summary: 'Find user by id' })
  async findUserById(@Query() findUserByIdInput: FindUserByIdDto) {
    return await this.userService.findUserById(findUserByIdInput);
  }

  @ApiBearerAuth()
  @Get('')
  @ApiOperation({ summary: 'Find user by token' })
  async findUserByToken(@Request() req: any) {
    return await this.userService.findUserByToken(req);
  }

  @ApiBearerAuth()
  @Post('update-profile')
  @ApiOperation({ summary: 'update profile by token' })
  async updateProfile(@Request() req: any, @Body() updateProfileInput: UpdateProfileDto) {
    return await this.userService.updateProfile(req, updateProfileInput);
  }
}

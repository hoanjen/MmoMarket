import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/signup.dto';
import { SignInDto } from './dtos/signin.dto';
import {
  ApiBasicAuth,
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { IsPublic, Role, Roles } from 'src/common/decorators/decorator.common';


@IsPublic()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}
  @IsPublic()
  @ApiOperation({ summary: 'Signup' })
  @Post('sign-up')
  async signUp(@Body() signUpInput: SignUpDto) {
    return this.authService.signUp(signUpInput);
  }

  @IsPublic()
  @ApiOperation({ summary: 'Signin' })
  @Post('signin')
  async signIn(@Body() signInInput: SignInDto) {
    return this.authService.signIn(signInInput);
  }
}

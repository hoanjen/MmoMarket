import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/signup.dto';
import { SignInDto } from './dtos/signin.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from './auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Signup' })
  @Post('sign-up')
  async signUp(@Body() signUpInput: SignUpDto) {
    return this.authService.signUp(signUpInput);
  }

  @ApiOperation({ summary: 'Signin' })
  @Post('signin')
  async signIn(@Body() signInInput: SignInDto) {
    return this.authService.signIn(signInInput);
  }
}

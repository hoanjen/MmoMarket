import { Injectable } from '@nestjs/common';
import { SignUpDto } from './dtos/signup.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async signUp(signUpInput: SignUpDto) {
    return await this.userService.createUser(signUpInput);
  }
}

import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { SignUpDto } from './dtos/signup.dto';
import { UserService } from '../user/user.service';
import { SignInDto } from './dtos/signin.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ReturnCommon } from 'src/common/utilities/base-response';
import { EResponse } from 'src/common/interface.common';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

  async signUp(signUpInput: SignUpDto) {
    return await this.userService.createUser(signUpInput);
  }
  async signIn(signUpInput: SignInDto) {
    const { email, password } = signUpInput;
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      throw new BadRequestException('email or password invalid !');
    }
    const hashPassword = await this.userService.getHashPassword(email);

    const checkpass = bcrypt.compareSync(password, hashPassword);

    if (!checkpass) {
      throw new BadRequestException('email or password invalid !');
    }
    const payload = {
      sub: user.id,
      type: 'accessToken',
      username: user.username,
    };
    const access_token = await this.jwtService.signAsync({ payload });
    const refresh_token = await this.jwtService.signAsync({
      ...payload,
      type: 'refreshToken',
    });

    return ReturnCommon({
      statusCode: HttpStatus.OK,
      status: EResponse.SUCCESS,
      data: {
        access_token,
        refresh_token,
        user_id: user.id,
      },
      message: 'Signin successfully !',
    });
  }
}

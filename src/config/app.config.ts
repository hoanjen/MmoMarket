import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: process.env.PORT || 8000,
  jwtSecret: process.env.JWT_SECRET,
  tokenExpiresTime: process.env.TOKEN_EXPIRES_TIME,
}));

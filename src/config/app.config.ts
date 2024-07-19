import { registerAs } from '@nestjs/config';

export default registerAs('', () => ({
  app: {
    port: process.env.PORT || 8000,
  },
  jwt: {
    jwtSecret: process.env.JWT_SECRET,
    tokenExpiresTime: process.env.TOKEN_EXPIRES_TIME,
  },
  otp: {
    mailUser: process.env.MAIL_USER,
    mailPassword: process.env.MAIL_PASSWORD,
    mailTransport: process.env.MAIL_TRANSPORT,
    mailHost: process.env.MAIL_HOST,
    mailPort: process.env.MAIL_PORT
  },
}));

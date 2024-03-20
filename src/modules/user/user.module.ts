import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Password } from './entity/password.entity';
import { Role } from './entity/role.entity';

@Module({
  imports :[TypeOrmModule.forFeature([
    User, Password, Role
  ])],
  controllers: [UserController],
  providers: [UserService] ,
  exports :[UserService]
})
export class UserModule {}

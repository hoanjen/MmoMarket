import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Password } from './entity/password.entity';
import { ROLE_MODEL, Role } from './entity/role.entity';
import { Repository, Transaction } from 'typeorm';

import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ReturnCommon } from 'src/common/utilities/base-response';
import { EResponse } from 'src/common/interface.common';
import { USER_ROLE } from './user.constant';
import { CreateUserDto } from './dtos/create-user.dto';
import { FindUserByIdDto } from './dtos/find-user-by-id.dto';
import { UpdateProfileDto } from './dtos/update-profile.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Password)
    private readonly passwordRepository: Repository<Password>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async findUserById(findUserByIdInput: FindUserByIdDto) {
    return await this.userRepository.findOne({
      where: { id: findUserByIdInput.user_id },
    });
  }

  async findRoleOfUserById(id: string) {
    const roleOfUser = await this.dataSource
      .getRepository(Role)
      .createQueryBuilder(ROLE_MODEL)
      .where('roles.user_id = :userId', { userId: id })
      .getOne();

    return roleOfUser;
  }

  async getHashPassword(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    const id = user.id;
    const pass = await this.passwordRepository
      .createQueryBuilder('pass')
      .where('user_id = :id', { id })
      .getOne();
    const hashPassword = pass.password;
    return hashPassword;
  }

  async findUserByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async createUser(createUserInput: CreateUserDto) {
    const {
      email,
      password,
      first_name,
      last_name,
      middle_name,
      gender,
      phone_number,
      username,
      cover_image,
      avatar,
      dob,
    } = createUserInput;
    const checkUserExisted = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email OR user.phone_number = :phone_number', {
        email,
        phone_number,
      })
      .getOne();

    if (checkUserExisted) {
      throw new BadRequestException('User existed');
    }
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      
      const newUser = this.userRepository.create({
        avatar,
        cover_image,
        email,
        first_name,
        gender,
        last_name,
        username,
        middle_name,
        phone_number,
        google_id: '123',
        dob,
      });
      console.log(111);
      const user = await queryRunner.manager.save(newUser);
      console.log(222)
      const salt = bcrypt.genSaltSync(10);
      const hashPassword = bcrypt.hashSync(password, salt);
      const newPassword = this.passwordRepository.create({
        user_id: user.id,
        password: hashPassword,
      });
      await queryRunner.manager.save(newPassword);

      const newRole = this.roleRepository.create({
        user,
        name: USER_ROLE.USER,
      });
      await queryRunner.manager.save(newRole);

      await queryRunner.commitTransaction();
      await queryRunner.release();
      return ReturnCommon({
        statusCode: HttpStatus.CREATED,
        status: EResponse.SUCCESS,
        data: {
          user,
        },
        message: 'Create user successfully',
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
    }
  }

  async createAdminByAdmin(createUserInput: CreateUserDto) {
    const {
      email,
      password,
      first_name,
      last_name,
      middle_name,
      gender,
      phone_number,
      username,
      cover_image,
      avatar,
      dob,
    } = createUserInput;
    const checkUserExisted = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email OR user.phone_number = :phone_number', {
        email,
        phone_number,
      })
      .getOne();

    if (checkUserExisted) {
      throw new BadRequestException('User existed');
    }
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();

      const newUser = this.userRepository.create({
        avatar,
        cover_image,
        email,
        first_name,
        gender,
        last_name,
        username,
        middle_name,
        phone_number,
        google_id: '123',
        dob,
      });
      const user = await queryRunner.manager.save(newUser);
      const salt = bcrypt.genSaltSync(10);
      const hashPassword = bcrypt.hashSync(password, salt);
      const newPassword = this.passwordRepository.create({
        user,
        password: hashPassword,
      });
      await queryRunner.manager.save(newPassword);

      const newRole = this.roleRepository.create({
        name: USER_ROLE.ADMIN,
        user,
      });
      await queryRunner.manager.save(newRole);

      await queryRunner.commitTransaction();
      await queryRunner.release();
      return ReturnCommon({
        statusCode: HttpStatus.CREATED,
        status: EResponse.SUCCESS,
        data: {
          user,
        },
        message: 'Create user successfully',
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
    }
  }

  async updateProfile(req: any, updateProfileInput: UpdateProfileDto) {}
}

import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Password } from './entity/password.entity';
import { Role } from './entity/role.entity';
import { Repository, Transaction } from 'typeorm';
import { SignUpDto } from '../auth/dtos/signup.dto';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ReturnCommon } from 'src/common/utilities/base-response';
import { EResponse } from 'src/common/interface.common';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Password)
    private passwordRepository: Repository<Password>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async findUserById(id: string) {
    return this.userRepository.findOne({
      where: { id },
    });
    const query = 'select * from user where id ';
    await this.dataSource.query(query);
  }

  async getHashPassword(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    const id = user.id;
    const pass = await this.passwordRepository
      .createQueryBuilder('pass')
      .where('user_id = :id', { id })
      .getOne();
    const hashPassword = pass.password;
    console.log(hashPassword);
    return hashPassword;
  }

  async findUserByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async createUser(signUpInput: SignUpDto) {
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
    } = signUpInput;
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

      const newRole = this.roleRepository.create(user);
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
}

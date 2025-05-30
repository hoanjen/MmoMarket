import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Password } from './entity/password.entity';
import { ROLE_MODEL, Role } from './entity/role.entity';
import { QueryFailedError, Repository, Transaction } from 'typeorm';

import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ReturnCommon } from 'src/common/utilities/base-response';
import { EResponse } from 'src/common/interface.common';
import { USER_ROLE } from './user.constant';
import { CreateUserDto } from './dtos/create-user.dto';
import { FindUserByIdDto } from './dtos/find-user-by-id.dto';
import { ForgotPassword, UpdateProfileDto } from './dtos/update-profile.dto';
import { Balance } from '../payment/entity/balance.entity';
import { relative } from 'path';
import { OtpService } from '../otp/otp.service';

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
    private readonly otpService: OtpService,
  ) {}

  async findUserByIdInternal(user_id: string) {
    const res = await this.userRepository.findOne({
      where: { id: user_id },
    });
    return res;
  }

  async findUserById(findUserByIdInput: FindUserByIdDto) {
    const res = await this.userRepository.findOne({
      where: { id: findUserByIdInput.user_id },
    });
    return ReturnCommon({
      data: res,
      message: 'Get user success',
      statusCode: HttpStatus.OK,
      status: EResponse.SUCCESS,
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
    const pass = await this.passwordRepository.createQueryBuilder('pass').where('user_id = :id', { id }).getOne();
    const hashPassword = pass.password;
    return hashPassword;
  }

  async findUserByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async findRoleByUserId(id: string) {
    return await this.roleRepository.findOne({
      where: {
        user_id: id,
      },
    });
  }

  async createUser(createUserInput: CreateUserDto) {
    const { email, password, first_name, last_name, gender, username, cover_image, avatar, dob } = createUserInput;
    const checkUserExisted = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email OR user.username = :username', {
        email,
        username,
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
        google_id: '123',
        dob,
      });
      let user;
      try {
        user = await queryRunner.manager.save(newUser);
      } catch (error) {
        if (error instanceof QueryFailedError && error.driverError.code === '23505') {
          //UNIQUE ERROR
          throw new BadRequestException('username is exist');
        }
      }
      const balance = queryRunner.manager.create(Balance, {
        account_balance: 0,
        user_id: user.id,
      });
      await queryRunner.manager.save(balance);

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
    const { email, password, first_name, last_name, gender, username, cover_image, avatar, dob } = createUserInput;

    const checkUserExisted = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email OR user.username = :username', {
        email,
        username,
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
        google_id: '123',
        dob,
      });
      let user;
      try {
        user = await queryRunner.manager.save(newUser);
      } catch (error) {
        if (error instanceof QueryFailedError && error.driverError.code === '23505') {
          //UNIQUE ERROR
          throw new BadRequestException('username is exist');
        }
      }

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
        data: user,
        message: 'Create user successfully',
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
    }
  }

  async findUserByToken(req: any) {
    const user = await this.userRepository.findOne({
      where: { id: req.user.sub },
      relations: ['balance'],
    });
    const role = await this.roleRepository.findOne({
      where: {
        user_id: user.id,
      },
    });
    return ReturnCommon({
      statusCode: HttpStatus.OK,
      status: EResponse.SUCCESS,
      data: {
        user: {
          ...user,
          role: role.name,
        },
      },
      message: 'Get user successfully',
    });
  }

  async updateProfile(req: any, updateProfileInput: UpdateProfileDto) {
    const { first_name, full_name, last_name, middle_name, avatar, cover_image, dob, gender, google_id, phone_number } =
      updateProfileInput;

    const updateObj = {};

    if (first_name) {
      updateObj['first_name'] = first_name;
    }
    if (full_name) {
      updateObj['full_name'] = full_name;
    }
    if (last_name) {
      updateObj['last_name'] = last_name;
    }
    if (middle_name) {
      updateObj['middle_name'] = middle_name;
    }
    if (avatar) {
      updateObj['avatar'] = avatar;
    }
    if (cover_image) {
      updateObj['cover_image'] = cover_image;
    }
    if (dob) {
      const dateNow = new Date();
      const dateBirth = new Date(dob);

      if (dateBirth > dateNow) {
        throw new BadRequestException('Date birth cannot be greater than current date');
      }
      updateObj['dob'] = dob;
    }
    if (gender) {
      updateObj['gender'] = gender;
    }
    if (google_id) {
      updateObj['google_id'] = google_id;
    }
    if (phone_number) {
      updateObj['phone_number'] = phone_number;
    }

    const user = await this.userRepository.findOne({
      where: { id: req.user.sub },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const updatedUser = Object.assign(user, updateObj);
    await this.userRepository.save(updatedUser);

    return ReturnCommon({
      statusCode: HttpStatus.OK,
      status: EResponse.SUCCESS,
      data: {
        user: updatedUser,
      },
      message: 'update profile successfully',
    });
  }

  async forgotPassword(forgotPasswordInput: ForgotPassword) {
    const { email, new_password, otp } = forgotPasswordInput;
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('Không tìm thấy user');
    }
    await this.otpService.veryOtp(email, Number(otp));
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(new_password, salt);
    const password = await this.passwordRepository.findOne({ where: { user_id: user.id } });
    password.password = hashPassword;
    await this.passwordRepository.save(password);
    return ReturnCommon({
      statusCode: HttpStatus.OK,
      status: EResponse.SUCCESS,
      data: '',
      message: 'Cập nhật mật khẩu thành công vui lòng đăng nhập lại',
    });
  }
}

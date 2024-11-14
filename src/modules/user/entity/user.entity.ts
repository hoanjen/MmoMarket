import { Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  PrimaryColumn,
  Generated,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { USER_GENDER } from '../user.constant';
import { Password } from './password.entity';
import { Role } from './role.entity';
import { Otp } from 'src/modules/otp/entity/otp.entity';
import { Product } from 'src/modules/product/entity/product.entity';
import { Order } from 'src/modules/order/entity/order.entity';
import { Comment } from 'src/modules/comment/entity/comment.entity';
import { Balance } from 'src/modules/payment/entity/balance.entity';
import { Transaction } from 'src/modules/payment/entity/transaction.entity';
import { Member } from 'src/modules/chat/entity/member.entity';
import { Group } from 'src/modules/chat/entity/group.entity';
import { Message } from 'src/modules/chat/entity/message.entity';

export const USER_MODEL = 'users';

@Entity(USER_MODEL)
export class User {
  @PrimaryColumn({ type: 'uuid' })
  @Generated('uuid')
  id: string;

  @Column()
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ nullable: true })
  full_name: string;

  @Column({ nullable: false, unique: true })
  username: string;

  @Column({ nullable: false })
  phone_number: string;

  @Column({ nullable: true })
  google_id: string;

  @Column({ nullable: true })
  @Transform(({ value }) => (typeof value === 'string' ? new Date(value) : value))
  dob: Date;

  @Column({
    nullable: true,
    type: 'enum',
    enum: USER_GENDER,
    default: USER_GENDER.OTHER,
  })
  gender: USER_GENDER;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  cover_image: string;

  @OneToOne(() => Balance, (balance) => balance.user)
  balance: Balance;

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  @OneToMany(() => Role, (role) => role.user) // specify inverse side as a second parameter
  roles: Role[];

  @OneToOne(() => Password, (password) => password.user) // specify inverse side as a second parameter
  password: Password;

  @OneToMany(() => Product, (product) => product.user)
  products: Product[];

  @OneToMany(() => Otp, (otp) => otp.user)
  otps: Otp;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Member, (member) => member.user)
  members: Member[];

  @OneToMany(() => Message, (message) => message.user)
  messages: Message[];

  @CreateDateColumn()
  created_at: Date; // Creation date

  @UpdateDateColumn()
  updated_at: Date;
}

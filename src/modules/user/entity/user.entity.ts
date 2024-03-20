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

  @Column()
  full_name: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ nullable: true })
  middle_name: string;

  @Column()
  username: string;

  @Column({ nullable: false })
  phone_number: string;

  @Column({ nullable: false })
  google_id: string;

  @Column()
  @Transform(({ value }) =>
    typeof value === 'string' ? new Date(value) : value,
  )
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

  @OneToOne(() => Role, (role) => role.user) // specify inverse side as a second parameter
  role: Role;

  @OneToOne(() => Password, (password) => password.user) // specify inverse side as a second parameter
  password: Password;

  @CreateDateColumn()
  created_at: Date; // Creation date

  @UpdateDateColumn()
  updated_at: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async validateEntity(): Promise<void> {
    if (this.first_name && this.first_name) {
      this.full_name = this.middle_name
        ? `${this.last_name} ${this.middle_name} ${this.first_name}`
        : `${this.last_name} ${this.first_name}`;
    }
  }
}

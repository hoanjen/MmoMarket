import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  Generated,
  OneToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { IsEnum } from 'class-validator';
import { USER_ROLE } from '../user.constant';
import { User } from './user.entity';

export const ROLE_MODEL = 'roles';

@Entity(ROLE_MODEL)
export class Role {
  @PrimaryColumn({ type: 'uuid' })
  @Generated('uuid')
  id: string;

  @Column({ type: 'enum', default: USER_ROLE.USER, enum: USER_ROLE })
  @IsEnum(USER_ROLE)
  name: USER_ROLE;

  @OneToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn()
  created_at: Date; // Creation date

  @UpdateDateColumn()
  updated_at: Date;
}

import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  Generated,
  OneToOne,
  JoinColumn,
  Column,
  ManyToOne,
  ManyToMany,
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

  @Column('string', { nullable: true })
  user_id: string;

  @ManyToOne(() => User, (user) => user.roles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User | string;

  @CreateDateColumn()
  created_at: Date; // Creation date

  @UpdateDateColumn()
  updated_at: Date;
}

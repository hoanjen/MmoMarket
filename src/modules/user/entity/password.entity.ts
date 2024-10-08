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
import { User } from './user.entity';

export const PASSWORD_MODEL = 'passwords';

@Entity(PASSWORD_MODEL)
export class Password {
  @PrimaryColumn({ type: 'uuid' })
  @Generated('uuid')
  id: string;

  @Column('string', { nullable: true })
  user_id: string;

  @OneToOne(() => User, (user) => user.password)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: false })
  password: string;

  @CreateDateColumn()
  created_at: Date; // Creation date

  @UpdateDateColumn()
  updated_at: Date;
}

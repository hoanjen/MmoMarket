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
import { User } from 'src/modules/user/entity/user.entity';

export const MAIL_MODEL = 'otps';

@Entity(MAIL_MODEL)
export class Otp {
  @PrimaryColumn({ type: 'uuid' })
  @Generated('uuid')
  id: string;

  @Column({ nullable: false })
  mail_type: string;

  @Column({ nullable: false })
  otp: string;

  @OneToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: false })
  expired: Date; // time expired

  @CreateDateColumn()
  created_at: Date; // Creation date

  @UpdateDateColumn()
  updated_at: Date;
}

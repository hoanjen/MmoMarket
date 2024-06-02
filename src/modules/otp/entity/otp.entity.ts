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
} from 'typeorm';
import { User } from 'src/modules/user/entity/user.entity';

export const OTP_MODEL = 'otps';

@Entity(OTP_MODEL)
export class Otp {
  @PrimaryColumn({ type: 'uuid' })
  @Generated('uuid')
  id: string;

  @Column({ nullable: false })
  mail_type: string;

  @Column({ nullable: false })
  otp: string;

  @Column('string', { nullable: true })
  user_id: string;

  @ManyToOne(() => User, (user) => user.otps, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: false })
  expired: Date; // time expired

  @CreateDateColumn()
  created_at: Date; // Creation date

  @UpdateDateColumn()
  updated_at: Date;
}

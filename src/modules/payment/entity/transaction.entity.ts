import { IsEnum } from 'class-validator';
import { User } from 'src/modules/user/entity/user.entity';
import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  Generated,
  JoinColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { PayMent } from '../payment.constants';

export const TRANSACTION_MODEL = 'transactions';

@Entity(TRANSACTION_MODEL)
export class Transaction {
  @PrimaryColumn({ type: 'uuid' })
  @Generated('uuid')
  id: string;

  @Column({ type: 'enum', enum: PayMent })
  @IsEnum(PayMent)
  action: PayMent;

  @Column({ nullable: false })
  amount: number;

  @Column({ nullable: false })
  user_id: string;

  @ManyToOne(() => User, (user) => user.transactions)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

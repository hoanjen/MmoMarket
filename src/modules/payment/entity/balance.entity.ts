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
  OneToMany,
  OneToOne,
} from 'typeorm';

export const BALANCE_MODEL = 'balances';

@Entity(BALANCE_MODEL)
export class Balance {
  @PrimaryColumn({ type: 'uuid' })
  @Generated('uuid')
  id: string;

  @Column({ nullable: false })
  account_balance: number;

  @Column({ nullable: false })
  user_id: string;

  @OneToOne(() => User, (user) => user.balance)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

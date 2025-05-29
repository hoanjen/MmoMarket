import { User } from 'src/modules/user/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Discount } from './discount.entity';
import { DataProductOrder } from './data-product-order.entity';
import { VansProduct } from 'src/modules/product/entity/vans-product.entity';
import { Order } from './order.entity';

export const FREEZE_ENTITY = 'freeze';

@Entity(FREEZE_ENTITY)
export class Freeze {
  @PrimaryColumn({ type: 'uuid' })
  @Generated('uuid')
  id: string;

  @Column({ nullable: false })
  order_id: string;

  @Column({ nullable: false })
  merchant_id: string;

  @Column({ nullable: false })
  amount: number;

  @Column({ nullable: false })
  return: number;

  @OneToOne(() => Order, (order) => order.freeze)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

import { User } from 'src/modules/user/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Discount } from './discount.entity';
import { DataProductOrder } from './data-product-order.entity';
import { VansProduct } from 'src/modules/product/entity/vans-product.entity';
import { Order } from './order.entity';

export const REPORT_ENTITY = 'reports';

@Entity(REPORT_ENTITY)
export class Report {
  @PrimaryColumn({ type: 'uuid' })
  @Generated('uuid')
  id: string;

  @Column({ nullable: false })
  user_id: string;

  @Column({ nullable: true })
  order_id: string;

  @Column({ nullable: false })
  merchant_id: string;

  @Column({ nullable: false })
  reason: string;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Order, (order) => order.reports)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

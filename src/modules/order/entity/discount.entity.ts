import { Column, CreateDateColumn, Entity, Generated, OneToMany, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { DiscountType } from '../order.constant';
import { Order } from './order.entity';

export const DISCOUNT_ENTITY = 'discounts';

@Entity(DISCOUNT_ENTITY)
export class Discount {
  @PrimaryColumn({ type: 'uuid' })
  @Generated('uuid')
  id: string;

  @Column({ nullable: false })
  total_discount: number;

  @Column({ nullable: false })
  time_end: Date;

  @Column({ nullable: false })
  discount_type: DiscountType;

  @OneToMany(() => Order, (order) => order.discount)
  orders: Order[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

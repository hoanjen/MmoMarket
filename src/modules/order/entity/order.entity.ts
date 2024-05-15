import { User } from "src/modules/user/entity/user.entity";
import { Column, CreateDateColumn, Entity, Generated, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { OrderDetail } from "./order-detail.entity";
import { Discount } from "./discount.entity";

export const ORDER_ENTITY = 'orders'

@Entity(ORDER_ENTITY)
export class Order {
  @PrimaryColumn({ type: 'uuid' })
  @Generated('uuid')
  id: string;

  @Column({ nullable: false })
  user_id: string;

  @Column({ nullable: false })
  discount_id: string;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order, {
    onDelete: 'CASCADE',
  })
  order_details: OrderDetail[];

  @ManyToOne(() => Discount, (discount) => discount.orders)
  @JoinColumn({ name: 'discount_id' })
  discount: Discount;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
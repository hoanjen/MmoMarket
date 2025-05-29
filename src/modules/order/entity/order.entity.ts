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
import { Report } from './report.entity';
import { StatusOrder } from '../order.constant';
import { Freeze } from './freeze.entity';
import { Comment } from 'src/modules/comment/entity/comment.entity';

export const ORDER_ENTITY = 'orders';

@Entity(ORDER_ENTITY)
export class Order {
  @PrimaryColumn({ type: 'uuid' })
  @Generated('uuid')
  id: string;

  @Column({ nullable: false })
  user_id: string;

  @Column({ nullable: true })
  discount_id: string;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: false })
  vans_product_id: string;

  @Column({ nullable: false })
  quantity: number;

  @Column({ nullable: false })
  price: number;

  @Column({
    nullable: false,
    type: 'enum',
    enum: StatusOrder,
    default: StatusOrder.FREEZE,
  })
  status: StatusOrder;

  @Column({ nullable: false })
  unlock_time: Date;

  @OneToMany(() => DataProductOrder, (dataProductOrder) => dataProductOrder.order)
  data_product_orders: DataProductOrder[];

  @OneToMany(() => Report, (report) => report.order)
  reports: Report[];

  @OneToOne(() => Freeze, (freeze) => freeze.order)
  freeze: Freeze;

  @ManyToOne(() => Discount, (discount) => discount.orders)
  @JoinColumn({ name: 'discount_id' })
  discount: Discount;

  @OneToMany(() => Comment, (comment) => comment.order)
  comments: Comment[];

  @ManyToOne(() => VansProduct, (vansProduct) => vansProduct.orders)
  @JoinColumn({ name: 'vans_product_id' })
  vans_product: VansProduct;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

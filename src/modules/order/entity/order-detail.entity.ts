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
import { Order } from './order.entity';
import { VansProduct } from 'src/modules/product/entity/vans-product.entity';
import { DataProductOrder } from './data-product-order.entity';

export const ORDER_DETAIL_ENTITY = 'order_details';

@Entity(ORDER_DETAIL_ENTITY)
export class OrderDetail {
  @PrimaryColumn({ type: 'uuid' })
  @Generated('uuid')
  id: string;

  @Column({ nullable: false })
  quantity: number;

  @Column({ nullable: false })
  price: number;

  @Column({ nullable: false })
  order_id: string;

  @Column({ nullable: false })
  vans_product_id: string;

  @ManyToOne(() => Order, (order) => order.order_details)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => VansProduct, (vansProduct) => vansProduct.order_details)
  @JoinColumn({ name: 'vans_product_id' })
  vans_product: VansProduct;

  @OneToMany(() => DataProductOrder, (dataProductOrder) => dataProductOrder.order_detail)
  data_product_order: DataProductOrder[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

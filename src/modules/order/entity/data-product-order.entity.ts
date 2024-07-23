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
import { DataProduct } from 'src/modules/product/entity/data-product.entity';
import { Order } from './order.entity';

export const DATA_PRODUCT_ORDER_ENTITY = 'data_product_orders';

@Entity(DATA_PRODUCT_ORDER_ENTITY)
export class DataProductOrder {
  @PrimaryColumn({ type: 'uuid' })
  @Generated('uuid')
  id: string;

  @Column({ nullable: false })
  order_id: string;

  @Column({ nullable: false })
  data_product_id: string;

  @ManyToOne(() => Order, (order) => order.data_product_orders)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @OneToOne(() => DataProduct, (dataProduct) => dataProduct.data_product_order)
  @JoinColumn({ name: 'data_product_id' })
  data_product: DataProduct;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

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
import { OrderDetail } from './order-detail.entity';
import { DataProduct } from 'src/modules/product/entity/data-product.entity';

export const DATA_PRODUCT_ORDER_ENTITY = 'data_product_orders';

@Entity(DATA_PRODUCT_ORDER_ENTITY)
export class DataProductOrder {
  @PrimaryColumn({ type: 'uuid' })
  @Generated('uuid')
  id: string;

  @Column({ nullable: false })
  order_detail_id: string;

  @Column({ nullable: false })
  data_product_id: string;

  @ManyToOne(() => OrderDetail, (orderDetail) => orderDetail.data_product_order)
  @JoinColumn({ name: 'order_detail_id' })
  order_detail: OrderDetail;

  @OneToOne(() => DataProduct, (dataProduct) => dataProduct.data_product_order)
  @JoinColumn({ name: 'data_product_id' })
  data_product: DataProduct;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

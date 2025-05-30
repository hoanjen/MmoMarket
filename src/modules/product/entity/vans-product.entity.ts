import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  Generated,
  OneToOne,
  JoinColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from 'src/modules/user/entity/user.entity';
import { CategoryType } from 'src/modules/category/entity/category-type.entity';
import { Product } from './product.entity';
import { DataProduct } from './data-product.entity';
import { Order } from 'src/modules/order/entity/order.entity';

export const VANS_PRODUCT_MODEL = 'vans_products';

@Entity(VANS_PRODUCT_MODEL)
export class VansProduct {
  @PrimaryColumn({ type: 'uuid' })
  @Generated('uuid')
  id: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: false })
  price: number;

  @Column({ nullable: false })
  quantity: number;

  @Column({ nullable: false })
  return_percent: number;

  @Column('string', { nullable: true })
  product_id: string;

  @ManyToOne(() => Product, (product) => product.vans_products, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @OneToMany(() => DataProduct, (dataProduct) => dataProduct.vans_product)
  @JoinColumn({ name: 'product_id' })
  data_products: DataProduct[];

  @OneToMany(() => Order, (order) => order.vans_product)
  orders: Order[];

  @CreateDateColumn()
  created_at: Date; // Creation date

  @UpdateDateColumn()
  updated_at: Date;
}

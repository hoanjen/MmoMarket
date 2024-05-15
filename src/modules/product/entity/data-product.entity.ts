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
import { VansProduct } from './vans-product.entity';
import { StatusProductSale } from '../product.constant';
import { OtherAccount } from './other-account.entity';
import { DataProductOrder } from 'src/modules/order/entity/data-product-order.entity';

export const DATA_PRODUCT_MODEL = 'data_products';

@Entity(DATA_PRODUCT_MODEL)
export class DataProduct {
  @PrimaryColumn({ type: 'uuid' })
  @Generated('uuid')
  id: string;

  @Column({ nullable: false })
  account: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: false })
  status: StatusProductSale;

  @Column('string', { nullable: true })
  vans_product_id: string;

  @ManyToOne(() => VansProduct, (vansProduct) => vansProduct.data_products, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'vans_product_id' })
  vans_product: VansProduct;

  @OneToMany(() => OtherAccount, (otherAccount) => otherAccount.data_product)
  other_accounts: OtherAccount[];

  @OneToOne(() => DataProductOrder, (dataProductOrder) => dataProductOrder.data_product)
  data_product_order?: DataProductOrder;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

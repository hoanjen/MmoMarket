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
import { DataProduct } from './data-product.entity';

export const OTHER_ACCOUNT_MODEL = 'other_accounts';

@Entity(OTHER_ACCOUNT_MODEL)
export class OtherAccount {
  @PrimaryColumn({ type: 'uuid' })
  @Generated('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  account: string;

  @Column({ nullable: false })
  password: string;

  @Column('string', { nullable: true })
  data_product_id: string;

  @ManyToOne(() => DataProduct, (dataProduct) => dataProduct.other_accounts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'data_product_id' })
  data_product: DataProduct;

  @CreateDateColumn()
  created_at: Date; // Creation date

  @UpdateDateColumn()
  updated_at: Date;
}

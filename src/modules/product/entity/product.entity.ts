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
import { VansProduct } from './vans-product.entity';

export const PRODUCT_MODEL = 'products';

@Entity(PRODUCT_MODEL)
export class Product {
  constructor(title, sub_title, description, image) {
    this.title = title;
    this.sub_title = sub_title;
    this.description = description;
    this.image = image;
    this.quantity_sold = 0;
    this.minPrice = 1e9;
    this.maxPrice = 0;
  }

  @PrimaryColumn({ type: 'uuid' })
  @Generated('uuid')
  id: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  sub_title: string;

  @Column({ nullable: false })
  description: string;

  @Column({ nullable: false })
  image: string;

  @Column({ nullable: false })
  quantity_sold: number;

  @Column({ nullable: false })
  maxPrice: number;

  @Column({ nullable: false })
  minPrice: number;

  @OneToMany(() => VansProduct, (vansProduct) => vansProduct.product)
  vans_products: VansProduct[];

  @Column('string', { nullable: true })
  category_type_id: string;

  @ManyToOne(() => CategoryType, (categoryType) => categoryType.products, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_type_id' })
  category_type: CategoryType;

  @Column('string', { nullable: true })
  user_id: string;

  @ManyToOne(() => User, (user) => user.products, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @CreateDateColumn()
  created_at: Date; // Creation date

  @UpdateDateColumn()
  updated_at: Date;
}

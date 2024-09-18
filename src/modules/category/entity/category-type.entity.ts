import {
  PrimaryColumn,
  Generated,
  Column,
  OneToMany,
  JoinColumn,
  Entity,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Category } from './category.entity';
import { Product } from 'src/modules/product/entity/product.entity';

export const CATEGORY_TYPE_MODEL = 'category_types';

@Entity(CATEGORY_TYPE_MODEL)
export class CategoryType {
  @PrimaryColumn({ type: 'uuid' })
  @Generated('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column('string', { nullable: true })
  category_id: string;

  @ManyToOne(() => Category, (category) => category.category_types, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'category_id' })
  category?: Category;

  @OneToMany(() => Product, (product) => product.category_type)
  products?: Product[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

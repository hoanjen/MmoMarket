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

export const SUBCATEGORY_MODEL = 'category_types';

@Entity(SUBCATEGORY_MODEL)
export class CategoryType {
  @PrimaryColumn({ type: 'uuid' })
  @Generated('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @ManyToOne(() => Category, (category) => category.category_types)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

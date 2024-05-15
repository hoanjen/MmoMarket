import {
  PrimaryColumn,
  Generated,
  Column,
  OneToMany,
  JoinColumn,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CategoryType } from './category-type.entity';

export const CATEGORY_MODEL = 'categorys';

@Entity(CATEGORY_MODEL)
export class Category {
  @PrimaryColumn({ type: 'uuid' })
  @Generated('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @OneToMany(() => CategoryType, (categoryType) => categoryType.category)
  category_types: [];

  @CreateDateColumn()
  created_at: Date; // Creation date

  @UpdateDateColumn()
  updated_at: Date;
}

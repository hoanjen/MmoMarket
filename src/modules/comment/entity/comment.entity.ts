import { Order } from 'src/modules/order/entity/order.entity';
import { Product } from 'src/modules/product/entity/product.entity';
import { User } from 'src/modules/user/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

const COMMENT_ENTITY = 'comments';

@Entity(COMMENT_ENTITY)
export class Comment {
  @PrimaryColumn({ type: 'uuid' })
  @Generated('uuid')
  id: string;

  @Column({ nullable: false })
  star: number;

  @Column({ nullable: false })
  content: string;

  @Column({ nullable: false })
  image: string;

  @Column({ nullable: false })
  user_id: string;

  @Column({ nullable: false })
  product_id: string;

  @Column({ nullable: false })
  order_id: string;

  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Order, (order) => order.comments)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Product, (product) => product.comments)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

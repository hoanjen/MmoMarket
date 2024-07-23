import { User } from "src/modules/user/entity/user.entity";
import { Column, CreateDateColumn, Entity, Generated, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { Discount } from "./discount.entity";
import { DataProductOrder } from "./data-product-order.entity";
import { VansProduct } from "src/modules/product/entity/vans-product.entity";

export const ORDER_ENTITY = 'orders'

@Entity(ORDER_ENTITY)
export class Order {
  @PrimaryColumn({ type: 'uuid' })
  @Generated('uuid')
  id: string;

  @Column({ nullable: false })
  user_id: string;

  @Column({ nullable: true })
  discount_id: string;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: true })
  vans_product_id: string;

  @OneToMany(() => DataProductOrder, (dataProductOrder) => dataProductOrder.order)
  data_product_orders: DataProductOrder[];

  @ManyToOne(() => Discount, (discount) => discount.orders)
  @JoinColumn({ name: 'discount_id' })
  discount: Discount;

  @ManyToOne(() => VansProduct, (vansProduct) => vansProduct.orders)
  @JoinColumn({ name: 'vans_product_id' })
  vans_product: VansProduct;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
import { IsNotEmpty } from 'class-validator';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

import { Order } from './order.entity';
import { Product } from './product.entity';

@Entity({ name: 'OrderDetails' })
export class OrderDetail {
  @PrimaryColumn()
  orderId: number;

  @PrimaryColumn()
  productId: number;

  @Column()
  quantity: number;

  @Column()
  price: number;

  @Column()
  discount: number;

  @ManyToOne(() => Product, (p) => p.orderDetails)
  product: Product;

  @ManyToOne(() => Order, (o) => o.orderDetails)
  order: Order;
}

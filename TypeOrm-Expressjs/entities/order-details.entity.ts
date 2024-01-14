import { IsNotEmpty } from 'class-validator';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

import { Order } from './order.entity';
import { Product } from './product.entity';

@Entity({ name: 'OrderDetails' })
export class OrderDetail {
  @PrimaryColumn({ type: 'int' })
  orderId: number;

  @PrimaryColumn({ type: 'int' })
  productId: number;

  @Column({ name: 'Quantity', type: 'decimal', precision: 18, scale: 2, default: 0 })
  quantity: number;

  @Column({ name: 'Price', type: 'decimal', precision: 18, scale: 2, default: 0 })
  price: number;

  @Column({ name: 'Discount', type: 'decimal', precision: 18, scale: 2, default: 0 })
  discount: number;

  @ManyToOne(() => Product, (p) => p.orderDetails)
  product: Product;

  @ManyToOne(() => Order, (o) => o.orderDetails)
  order: Order;
}

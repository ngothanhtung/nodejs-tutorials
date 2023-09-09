import { IsNotEmpty } from 'class-validator';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

import { Order } from './order.entity';
import { Product } from './product.entity';

@Entity({ name: 'OrderDetails' })
export class OrderDetail {
  @PrimaryColumn({ name: 'OrderId' })
  orderId: number;

  @PrimaryColumn({ name: 'ProductId' })
  productId: number;

  @Column({ name: 'Quantity', type: 'decimal', precision: 18, scale: 2 })
  quantity: number;

  @Column({ name: 'Price', type: 'decimal', precision: 18, scale: 2 })
  price: number;

  @Column({ name: 'Discount', type: 'decimal', precision: 18, scale: 2 })
  discount: number;

  @ManyToOne(() => Product, (p) => p.orderDetails)
  product: Product;

  @ManyToOne(() => Order, (o) => o.orderDetails)
  order: Order;
}

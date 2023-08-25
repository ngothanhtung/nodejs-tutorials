import { IsIn, MaxLength, ValidateIf } from 'class-validator';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { OrderDetail } from './order-details.entity';
import { Customer } from './customer.entity';
import { Employee } from './employee.entity';

@Entity({ name: 'Orders' })
export class Order {
  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number;

  @Column({ name: 'CreatedDate', default: () => 'CURRENT_TIMESTAMP' })
  createdDate: Date;

  @Column({ name: 'ShippedDate', nullable: true })
  shippedDate: Date;

  // ----------------------------------------------------------------------------------------------
  // STATUS
  // ----------------------------------------------------------------------------------------------
  @Column({ name: 'Status', default: 'WAITING', length: 50 })
  status: string;

  // ----------------------------------------------------------------------------------------------
  // DESCRIPTION
  // ----------------------------------------------------------------------------------------------
  @Column({ name: 'Description', nullable: true })
  description: string;

  // ----------------------------------------------------------------------------------------------
  // SHIPPING ADDRESS
  // ----------------------------------------------------------------------------------------------
  @Column({ name: 'ShippingAddress', nullable: true, length: 500 })
  shippingAddress: string;

  // ----------------------------------------------------------------------------------------------
  // SHIPPING CITY
  // ----------------------------------------------------------------------------------------------
  @Column({ name: 'ShippingCity', nullable: true, length: 50 })
  shippingCity: string;

  // ----------------------------------------------------------------------------------------------
  // PAYMENT TYPE
  // ----------------------------------------------------------------------------------------------
  @Column({ name: 'PaymentType', default: 'CASH' })
  paymentType: string;

  @Column()
  customerId: number;

  @Column()
  employeeId: number;

  // RELATIONS
  @ManyToOne(() => Customer, (c) => c.orders)
  customer: Customer;

  @ManyToOne(() => Employee, (e) => e.orders)
  employee: Employee;

  @OneToMany(() => OrderDetail, (od) => od.order)
  orderDetails: OrderDetail[];
}

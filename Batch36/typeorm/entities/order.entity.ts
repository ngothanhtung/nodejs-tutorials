import { IsIn, MaxLength, ValidateIf } from 'class-validator';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { OrderDetail } from './order-details.entity';
import { Customer } from './customer.entity';
import { Employee } from './employee.entity';

@Entity({ name: 'Orders' })
export class Order {
  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number;

  @Column({ name: 'CreatedDate', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdDate: Date;

  @Column({ name: 'ShippedDate', type: 'datetime', nullable: true })
  shippedDate: Date;

  // ----------------------------------------------------------------------------------------------
  // STATUS
  // ----------------------------------------------------------------------------------------------
  @Column({ name: 'Status', type: 'varchar', default: 'WAITING', length: 50 })
  status: string;

  // ----------------------------------------------------------------------------------------------
  // DESCRIPTION
  // ----------------------------------------------------------------------------------------------
  @Column({ name: 'Description', type: 'nvarchar', length: 'MAX', nullable: true })
  description: string;

  // ----------------------------------------------------------------------------------------------
  // SHIPPING ADDRESS
  // ----------------------------------------------------------------------------------------------
  @Column({ name: 'ShippingAddress', type: 'nvarchar', nullable: true, length: 500 })
  shippingAddress: string;

  // ----------------------------------------------------------------------------------------------
  // SHIPPING CITY
  // ----------------------------------------------------------------------------------------------
  @Column({ name: 'ShippingCity', type: 'nvarchar', nullable: true, length: 50 })
  shippingCity: string;

  // ----------------------------------------------------------------------------------------------
  // PAYMENT TYPE
  // ----------------------------------------------------------------------------------------------
  @Column({ name: 'PaymentType', type: 'varchar', length: 20, default: 'CASH' })
  paymentType: string;

  @Column({ type: 'int' })
  customerId: number;

  @Column({ type: 'int' })
  employeeId: number;

  // RELATIONS
  @ManyToOne(() => Customer, (c) => c.orders)
  customer: Customer;

  @ManyToOne(() => Employee, (e) => e.orders)
  employee: Employee;

  @OneToMany(() => OrderDetail, (od) => od.order)
  orderDetails: OrderDetail[];
}

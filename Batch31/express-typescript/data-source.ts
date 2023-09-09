require('dotenv').config();
import 'reflect-metadata';

import { DataSource } from 'typeorm';
import { Category } from './entities/category.entity';
import { Supplier } from './entities/supplier.entity';
import { Customer } from './entities/customer.entity';
import { Employee } from './entities/employee.entity';
import { Product } from './entities/product.entity';
import { Order } from './entities/order.entity';
import { OrderDetail } from './entities/order-details.entity';

export const AppDataSource = new DataSource({
  type: 'mssql',
  host: '113.160.224.121',
  port: 1433,
  username: 'developer',
  password: 'developer',
  database: 'TypeOrm',
  // entities: ['entities/**/*.entity{.ts,.js}', 'entities/**/*.schema{.ts,.js}'],
  entities: [Category, Supplier, Customer, Employee, Product, Order, OrderDetail],
  synchronize: true,
  logging: false,
  options: {
    encrypt: false,
  },
});

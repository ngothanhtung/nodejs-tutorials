require('dotenv').config();
import 'reflect-metadata';

import { DataSource } from 'typeorm';

import { Category } from './entities/category.entity';
import { Customer } from './entities/customer.entity';
import { Employee } from './entities/employee.entity';
import { OrderDetail } from './entities/order-details.entity';
import { Order } from './entities/order.entity';
import { Product } from './entities/product.entity';
import { SeparatingCategory } from './entities/schemas/category.schema';
import { Supplier } from './entities/supplier.entity';
import { CategoryView } from './entities/views/category-view.entity';

export const AppDataSource = new DataSource({
  type: 'mssql',
  host: '113.160.224.121', // "localhost" "127.0.0.1"
  port: 1433,
  username: 'developer',
  password: 'developer',
  database: 'TypeOrm',
  // entities: ['entities/**/*.entity{.ts,.js}', 'entities/**/*.schema{.ts,.js}'],
  entities: [Category, Supplier, Product, Customer, Employee, Order, OrderDetail, CategoryView, SeparatingCategory],
  synchronize: true,
  logging: false,
  options: {
    encrypt: false,
  },
});

require('dotenv').config();
import 'reflect-metadata';

import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'mssql',
  host: '113.160.224.121',
  port: 1433,
  username: 'developer',
  password: 'developer',
  database: 'onlineshop',
  entities: ['entities/**/*.entity{.ts,.js}'],
  synchronize: false,
  logging: false,
  options: {
    encrypt: false,
  },
});

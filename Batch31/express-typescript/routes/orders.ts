import express, { Express, NextFunction, Request, Response } from 'express';

import { AppDataSource } from '../data-source';
import { OrderDetail } from '../entities/order-details.entity';
import { Order } from '../entities/order.entity';

const router = express.Router();

const repository = AppDataSource.getRepository(Order);

/* GET orders */
router.get('/', async (req: Request, res: Response, next: any) => {
  try {
    // SELECT * FROM [Products] AS 'product'
    const orders = await repository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.customer', 'customer')
      .leftJoinAndSelect('order.employee', 'employee')
      .leftJoinAndSelect('order.orderDetails', 'orderDetails')
      .leftJoinAndSelect('orderDetails.product', 'product')
      .leftJoinAndSelect('product.category', 'category')
      .select([
        'order.id',
        'order.createdDate',
        'order.shippedDate',
        'order.shippingAddress',
        'order.shippingCity',
        'order.paymentType',
        'order.status',
        'order.description',
        'order.customerId',
        'order.employeeId',
        'customer',
        'employee',
        'orderDetails.quantity',
        'orderDetails.price',
        'orderDetails.discount',
        'product',
        'category',
      ])
      .getMany();

    if (orders.length === 0) {
      res.status(204).send();
    } else {
      res.json(orders);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/* POST order */
router.post('/', async (req: Request, res: Response, next: any) => {
  try {
    const queryRunner = repository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    // Begin transaction
    await queryRunner.startTransaction();

    const order = req.body as Order;

    // Lưu thông tin order
    const result = await queryRunner.manager.save(Order, order);

    // Lưu thông tin order details
    const orderDetails = order.orderDetails.map((od) => {
      return { ...od, orderId: result.id };
    });

    await queryRunner.manager.save(OrderDetail, orderDetails);

    // Commit transaction
    await queryRunner.commitTransaction();

    const orderResult = await repository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.customer', 'customer')
      .leftJoinAndSelect('order.employee', 'employee')
      .leftJoinAndSelect('order.orderDetails', 'orderDetails')
      .leftJoinAndSelect('orderDetails.product', 'product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.supplier', 'supplier')
      .where('order.id = :id', { id: result.id })
      .select([
        'order.id',
        'order.createdDate',
        'order.shippedDate',
        'order.shippingAddress',
        'order.shippingCity',
        'order.paymentType',
        'order.status',
        'order.description',
        'order.customerId',
        'order.employeeId',
        'customer',
        'employee',
        'orderDetails.quantity',
        'orderDetails.price',
        'orderDetails.discount',
        'product',
        'category',
        'supplier',
      ])
      .getOne();

    res.json(orderResult);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

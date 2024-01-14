import express, { Request, Response } from 'express';

import { AppDataSource } from '../data-source';
import { Product } from '../entities/product.entity';

const router = express.Router();

const repository = AppDataSource.getRepository(Product);

/* GET products */
router.get('/', async (req: Request, res: Response, next: any) => {
  try {
    // SELECT * FROM [Products] AS 'product'
    const products = await repository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.supplier', 'supplier')
      .getMany();

    if (products.length === 0) {
      res.status(204).send();
    } else {
      res.json(products);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/* GET product by id */
router.get('/:id', async (req: Request, res: Response, next: any) => {
  try {
    const product = await repository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.supplier', 'supplier')
      .where('product.id = :id', { id: parseInt(req.params.id) })
      .getOne();
    if (!product) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/* POST product */
router.post('/', async (req: Request, res: Response, next: any) => {
  try {
    const product = new Product();
    Object.assign(product, req.body);
    await repository.save(product);
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/* PATCH product */
router.patch('/:id', async (req: Request, res: Response, next: any) => {
  try {
    const product = await repository.findOneBy({ id: parseInt(req.params.id) });
    if (!product) {
      return res.status(404).json({ error: 'Not found' });
    }

    Object.assign(product, req.body);

    await repository.save(product);

    const updatedCategory = await repository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.category', 'c')
      .where('p.id = :id', { id: parseInt(req.params.id) })
      .getOne();
    res.json(updatedCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/* DELETE product */
router.delete('/:id', async (req: Request, res: Response, next: any) => {
  try {
    const product = await repository.findOneBy({ id: parseInt(req.params.id) });
    if (!product) {
      return res.status(404).json({ error: 'Not found' });
    }
    await repository.delete({
      id: product.id,
    });
    res.status(200).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

import express, { Express, NextFunction, Request, Response } from 'express';

import { AppDataSource } from '../data-source';
import { Supplier } from '../entities/supplier.entity';

const router = express.Router();

const repository = AppDataSource.getRepository(Supplier);

/* GET suppliers */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const suppliers = await repository.find();
    if (suppliers.length === 0) {
      res.status(204).send();
    } else {
      res.json(suppliers);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/* GET supplier by id */
router.get('/:id', async (req: Request, res: Response, next: any) => {
  try {
    const supplier = await repository.findOneBy({ id: parseInt(req.params.id) });
    if (!supplier) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.json(supplier);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/* POST supplier */
router.post('/', async (req: Request, res: Response, next: any) => {
  try {
    const supplier = new Supplier();
    Object.assign(supplier, req.body);
    await repository.save(supplier);
    res.status(201).json(supplier);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/* PATCH supplier */
router.patch('/:id', async (req: Request, res: Response, next: any) => {
  try {
    const supplier = await repository.findOneBy({ id: parseInt(req.params.id) });
    if (!supplier) {
      return res.status(404).json({ error: 'Not found' });
    }

    Object.assign(supplier, req.body);
    await repository.save(supplier);

    const updatedCategory = await repository.findOneBy({ id: parseInt(req.params.id) });
    res.json(updatedCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/* DELETE supplier */
router.delete('/:id', async (req: Request, res: Response, next: any) => {
  try {
    const supplier = await repository.findOneBy({ id: parseInt(req.params.id) });
    if (!supplier) {
      return res.status(404).json({ error: 'Not found' });
    }
    await repository.delete({ id: supplier.id });
    res.status(200).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

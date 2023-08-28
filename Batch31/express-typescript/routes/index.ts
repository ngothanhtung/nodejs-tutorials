import express, { Express, NextFunction, Request, Response } from 'express';

import { AppDataSource } from '../data-source';
import { Product } from '../entities/product.entity';
import { CategoryInterface, SeparatingCategory } from '../entities/schemas/category.schema';
import { CategoryView } from '../entities/views/category-view.entity';

const router = express.Router();

const repository = AppDataSource.getRepository(Product);
const categoryRepository = AppDataSource.getRepository<CategoryInterface>(SeparatingCategory);
const viewRepository = AppDataSource.getRepository(CategoryView);

/* GET home page. */
router.get('/', function (req: Request, res: Response, next: any) {
  res.json({ message: 'Hello world!' });
});

router.get('/call-separating-entity', async (req: Request, res: Response, next: any) => {
  try {
    const categories = await categoryRepository.find();
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/call-raw-sql', async (req: Request, res: Response, next: any) => {
  try {
    const results = await repository.manager.connection.query('SELECT * FROM Orders AS O WHERE O.Id = @0', [10]);
    res.json(results);
    // res.json(toCamelCase(results));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Call store procedure
router.get('/call-stored-procedure', async (req: Request, res: Response, next: any) => {
  try {
    const results = await repository.manager.connection.query('EXECUTE [dbo].[usp_Products_CheckStock] @0', [15]);
    res.json(toCamelCase(results));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/view', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await viewRepository.find();
    if (categories.length === 0) {
      res.status(204).send();
    } else {
      res.json(categories);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

interface AnyObject {
  [key: string]: any;
}

function toCamelCase(o: AnyObject) {
  var newO: AnyObject = {},
    origKey: string,
    newKey: string,
    value: any;
  if (o instanceof Array) {
    return o.map(function (value) {
      if (typeof value === 'object') {
        value = toCamelCase(value);
      }
      return value;
    });
  } else {
    for (origKey in o) {
      if (o.hasOwnProperty(origKey)) {
        newKey = (origKey.charAt(0).toLowerCase() + origKey.slice(1) || origKey).toString();
        value = o[origKey];
        if (value instanceof Array || (value !== null && value.constructor === Object)) {
          value = toCamelCase(value);
        }
        newO[newKey] = value;
      }
    }
  }
  return newO;
}

export default router;

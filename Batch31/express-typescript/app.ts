import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Express, NextFunction, Request, Response } from 'express';
import logger from 'morgan';
import path from 'path';

import { AppDataSource } from './data-source';
import categoriesRouter from './routes/categories';
import indexRouter from './routes/index';
import ordersRouter from './routes/orders';
import productsRouter from './routes/products';
import suppliersRouter from './routes/suppliers';

const app: Express = express();

AppDataSource.initialize().then(async () => {
  console.log('Data source was initialized');

  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));

  // use cors
  app.use(cors({ origin: '*' }));

  app.use('/', indexRouter);
  app.use('/categories', categoriesRouter);
  app.use('/products', productsRouter);
  app.use('/suppliers', suppliersRouter);
  app.use('/orders', ordersRouter);

  // catch 404 and forward to error handler
  app.use(function (req: Request, res: Response, next: NextFunction) {
    res.status(404).send('Not found');
    // next(createError(404));
  });

  // error handler
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
});

export default app;

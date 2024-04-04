import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Express, NextFunction, Request, Response } from 'express';
import { initialize } from 'express-openapi';
import logger from 'morgan';
import path from 'path';
import swaggerUi from 'swagger-ui-express';

import { AppDataSource } from './data-source';
// OPEN API
import apiDoc from './docs/apiDoc';
import advancedRouter from './routes/advanced';
import categoriesRouter from './routes/categories';
import indexRouter from './routes/index';
import ordersRouter from './routes/orders';
import productsRouter from './routes/products';
import suppliersRouter from './routes/suppliers';

const app: Express = express();

initialize({
  app,
  // NOTE: If using yaml you can provide a path relative to process.cwd() e.g.
  // apiDoc: './api-v1/api-doc.yml',
  apiDoc: apiDoc,
  dependencies: {},
  paths: './api-routes',
});

// OpenAPI UI
app.use(
  '/open-api',
  swaggerUi.serve,
  swaggerUi.setup(apiDoc, {
    explorer: true,
    swaggerOptions: {},
  }),
);

AppDataSource.initialize().then(async () => {
  console.log('Data source was initialized');
});

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
app.use('/advanced', advancedRouter);

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

export default app;

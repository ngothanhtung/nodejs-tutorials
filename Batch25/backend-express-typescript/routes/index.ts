import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

var router = express.Router();

/* GET home page. */
router.get('/', function (req: Request, res: Response, next: any) {
  res.render('index', { title: 'Express' });
});

export default router;

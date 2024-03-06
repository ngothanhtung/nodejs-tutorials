import express, { Express, NextFunction, Request, Response } from 'express';

const router = express.Router();

/* GET home page. */
router.get('/', function (req: Request, res: Response, next: any) {
  res.json({ message: 'Hello world!' });
});

export default router;

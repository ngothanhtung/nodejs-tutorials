import express, { Express, Request, Response } from 'express';
const router = express.Router();

/* GET users listing. */
router.get('/', (req: Request, res: Response, next: any) => {
  res.json({ message: 'Users' });
});

export default router;

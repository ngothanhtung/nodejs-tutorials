// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  name: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  console.log(req.body);
  console.log(req.method);
  console.log(req.query);
  switch (req.method) {
    case 'GET':
      // Code here ...
      break;
    case 'POST':
      // Code here ...
      break;
    case 'PATCH':
      // Code here ...
      break;
    case 'DELETE':
      // Code here ...
      break;
    default:
      // Code here ...
      break;
  }
  res.status(200).json({ name: 'John Doe' });
}

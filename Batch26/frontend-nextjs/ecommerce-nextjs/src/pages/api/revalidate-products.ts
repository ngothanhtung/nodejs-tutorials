// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  message?: string;
  revalidated?: boolean;
};

// https://<your-site.com>/api/revalidate?secret=<token>
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  // Check for secret to confirm this is a valid request
  if (req.query.secret !== 'vungoimora') {
    return res.status(401).json({ message: 'Invalid token' });
  }

  try {
    // this should be the actual path not a rewritten path
    // e.g. for "/blog/[slug]" this should be "/blog/post-1"
    await res.revalidate('/shop/products');
    return res.json({ revalidated: true });
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send({ message: 'Error revalidating' });
  }
}

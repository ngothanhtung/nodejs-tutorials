import { revalidatePath } from 'next/cache';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get('path');

  if (path === 'all') {
    revalidatePath(path, 'layout');
    return Response.json({ revalidated: true, type: 'layout', now: Date.now() });
  } else if (path) {
    revalidatePath(path ?? '/', 'page');
    return Response.json({ revalidated: true, now: Date.now() });
  }

  return Response.json({
    revalidated: false,
    now: Date.now(),
    message: 'Missing path to revalidate',
  });
}

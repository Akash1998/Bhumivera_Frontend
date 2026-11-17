import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export default async function registerPage(req, res) {
  res.setHeader('Cache-Control', 'private, no-store, no-cache, max-age=0, must-revalidate');
  res.setHeader('CDN-Cache-Control', 'no-store');
  res.setHeader('Vercel-CDN-Cache-Control', 'no-store');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  if (!['GET', 'HEAD'].includes(req.method)) {
    res.setHeader('Allow', 'GET, HEAD');
    return res.status(405).end();
  }

  try {
    const html = await readFile(join(process.cwd(), 'dist', 'index.html'), 'utf8');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).end(req.method === 'HEAD' ? undefined : html);
  } catch (error) {
    console.error('[REGISTER_PAGE_LOAD_ERROR]', error);
    return res.status(500).end('Registration page is temporarily unavailable.');
  }
}

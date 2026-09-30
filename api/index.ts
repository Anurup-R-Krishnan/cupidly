import app from '../server';

export default function handler(req: any, res: any) {
  const matched = req.headers['x-matched-path'] || req.headers['x-now-route-matches'];
  if (matched && typeof matched === 'string' && matched.startsWith('/api')) {
    req.url = matched;
  }
  return app(req, res);
}

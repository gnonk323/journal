import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

export function apiKeyMiddleware(req: Request, res: Response, next: NextFunction) {
  const headerKey = req.header('x-api-key');
  const authHeader = req.header('authorization');

  const bearerKey = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  const apiKey = headerKey || bearerKey;

  if (!apiKey) {
    return res.status(401).json({ error: 'API key required' });
  }

  if (apiKey !== env.apiKey) {
    return res.status(403).json({ error: 'Invalid API key' });
  }

  next();
}
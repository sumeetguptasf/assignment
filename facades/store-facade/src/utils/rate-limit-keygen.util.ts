import {Request} from '@loopback/rest';

/**
 * Rate limit key generator
 * - Uses userId when available
 * - Falls back to path params (e.g., productId, userId in URL)
 * - Finally falls back to IP address for guests
 */
export function rateLimitKeyGen(req: Request): string {
  const userId = (req as any).user?.id;
  let key: string;
  console.log(`[RateLimitKeyGen] Incoming request path: ${req.path}`);
  console.log(`[RateLimitKeyGen] Params:`, req.params);
  console.log(`[RateLimitKeyGen] User:`, (req as any)?.user);
  console.log(`[RateLimitKeyGen] User ID: ${userId}`);

  if (userId) {
    key = `user-${userId}`;
  } else if (req.params?.userId) {
    key = `user-${req.params.userId}`;
  } else if (req.params?.productId) {
    key = `product-${req.params.productId}`;
  } else {
    const ip = req.ip || req.connection?.remoteAddress || 'unknown';
    key = `ip-${ip}`;
  }

  console.log(`[RateLimitKeyGen] Generated key: ${key}`);
  return key;
}
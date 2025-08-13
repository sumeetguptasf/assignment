import {Middleware, MiddlewareContext, Response, RequestContext} from '@loopback/rest';
import {RateLimiterRedis} from 'rate-limiter-flexible';
import Redis from 'ioredis';


// this is workjing rate limiter
const redisClient = new Redis({
  host: '127.0.0.1',
  port: 6379,
  password: 'redispassword',
  enableOfflineQueue: false,
});

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  points: 5,
  duration: 60,
  keyPrefix: 'rlflx',
});

export const redisRateLimiter: Middleware = async (
  ctx: MiddlewareContext,
  next,
) => {
  const req = ctx.request;
  const res = ctx.response as Response;

  const key = req.ip ?? 'unknown-ip';

  try {
    await rateLimiter.consume(key);
    return next();
  } catch (rejRes) {
    res.status(429).send({
      message: 'Too Many Requests',
      retryAfter: Math.round(rejRes.msBeforeNext / 1000),
    });
    return res;
  }
};
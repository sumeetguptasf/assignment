import { Middleware, RequestContext } from '@loopback/rest';
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';

const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: +(process.env.REDIS_PORT || 6379),
    password: process.env.REDIS_PASSWORD || 'redispassword',
});


export const inMemoryRateLimiter: Middleware = (() => {
    const counts: Record<string, number> = {};
    const WINDOW_MS = 60000;
    const MAX = 100;

    setInterval(() => Object.keys(counts).forEach(key => counts[key] = 0), WINDOW_MS);

    return async (ctx, next) => {
        const ip = ctx.request.ip || '';
        counts[ip] = (counts[ip] || 0) + 1;
        if (counts[ip] > MAX) {
            ctx.response.status(429).send({ error: 'Too many requests' });
            return;
        }
        return next();
    };
})();
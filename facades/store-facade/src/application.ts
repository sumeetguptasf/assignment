import { BootMixin } from '@loopback/boot';
import { ApplicationConfig, Component } from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import { RepositoryMixin } from '@loopback/repository';
import { RestApplication } from '@loopback/rest';
import { ServiceMixin } from '@loopback/service-proxy';
import path from 'path';
import { MySequence } from './sequence';
import { inMemoryRateLimiter } from './middleware/rate-limiter.middleware';
import { RateLimiterComponent, RateLimitSecurityBindings } from 'loopback4-ratelimiter';
import Redis from 'ioredis';
import { rateLimitKeyGen } from './utils/rate-limit-keygen.util';
import {redisRateLimiter} from './middleware/redis-rate-limiter.middleware';


export { ApplicationConfig };

export class StoreFacadeApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);



    const redisClient = new Redis({
      host: '127.0.0.1',
      port: 6379,
      password: 'redispassword',
    });
    // this.middleware(inMemoryRateLimiter);
    this.middleware(redisRateLimiter);
    // this.component(RateLimiterComponent as any);

      // using redis as the store
    // this.bind(RateLimitSecurityBindings.CONFIG).to({
    //   name: 'redis',
    //   type: 'RedisStore',
    //   storeClient: redisClient,
    //   points: 2,
    //   duration: 60,
    //   skipFailedRequests: false,
    //   keyGenerator: rateLimitKeyGen,
    // });

    this.bind(RateLimitSecurityBindings.CONFIG).to({
      name: 'inMemory',
      type: 'InMemoryStore',
      points: 10,
      duration: 60,
      skipFailedRequests: false,
      keyGenerator: rateLimitKeyGen,
    });

    // Now set the sequence
    this.sequence(MySequence);
    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}

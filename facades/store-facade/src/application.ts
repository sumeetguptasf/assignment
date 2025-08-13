import { BootMixin } from '@loopback/boot';
import { ApplicationConfig, Component, inject } from '@loopback/core';
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
import { redisRateLimiter } from './middleware/redis-rate-limiter.middleware';
import { AuthenticationComponent, registerAuthenticationStrategy } from '@loopback/authentication';
import { JWTAuthenticationComponent, JWTAuthenticationStrategy, JWTService, TokenServiceBindings } from '@loopback/authentication-jwt';
import { ProductServiceProvider } from './services/product.service.interface';

export { ApplicationConfig };
import * as dotenv from 'dotenv';
import { ProductServiceDataSource } from './datasources';
dotenv.config();

export class StoreFacadeApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {

  constructor(options: ApplicationConfig = {}) {
    super(options);
    // Bind ProductService so it’s available for injection
    this.dataSource(ProductServiceDataSource);
    this.service(ProductServiceProvider);

    // RATE LIMITER CONFIGURATION
    const redisClient = new Redis({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: Number(process.env.REDIS_PORT) || 6379,
    });


    // this.middleware(inMemoryRateLimiter);
    // this.middleware(redisRateLimiter);
    this.component(RateLimiterComponent as any);

    // using redis as the store
    this.bind(RateLimitSecurityBindings.CONFIG).to({
      name: 'redis',
      type: 'RedisStore',
      storeClient: redisClient,
      points: 2,
      duration: 60,
      skipFailedRequests: false,
      keyGenerator: rateLimitKeyGen,
    });

    // this.bind(RateLimitSecurityBindings.CONFIG).to({
    //   name: 'inMemory',
    //   type: 'InMemoryStore',
    //   points: 10,
    //   duration: 60,
    //   skipFailedRequests: false,
    //   keyGenerator: rateLimitKeyGen,
    // });

    // AUTHENTICATION CONFIGURATION
    this.component(AuthenticationComponent);
    this.component(JWTAuthenticationComponent);
    // Register the JWT strategy
    registerAuthenticationStrategy(this, JWTAuthenticationStrategy);
    // this.bind('authentication.jwt.secret').to(process.env.JWT_SECRET ?? '');
    // this.bind('authentication.jwt.expiresIn').to('86400'); // optional, expiry in seconds
    // this.bind('authentication.jwt.service').toClass(JWTService);
    // Bind JWT configuration
    this.bind(TokenServiceBindings.TOKEN_SECRET).to(process.env.JWT_SECRET ?? '');
    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(process.env.JWT_EXPIRES_IN ?? '86400');
    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTService);



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

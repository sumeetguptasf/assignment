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
import { ProductServiceProvider } from './services/product.service.provider';
import { OrderServiceDataSource, ProductServiceDataSource, UserServiceDataSource } from './datasources';
import { AuthorizationBindings, AuthorizationComponent, AuthorizationTags } from '@loopback/authorization';
import { RolePermissionAuthorizerProvider } from './authorization/role-permission.authorizer';
import { MyJWTService } from './services/my-token.service';
import { AuthenticateActionProvider, AuthenticationBindings, registerAuthenticationStrategy } from '@loopback/authentication';
import { UserServiceProvider } from './services/user-service.provider';
import { AuthenticationComponent } from '@loopback/authentication';
import {
  JWTAuthenticationComponent,
  JWTService,
  TokenServiceBindings,
  UserServiceBindings,
} from '@loopback/authentication-jwt';
import { RoleAuthorizationProvider } from './authorization/role.authorizer';
import { NotificationProxyService } from './services';
import { OrderServiceProvider } from './services/order-service.provider';

export { ApplicationConfig };

export class StoreFacadeApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {

  constructor(options: ApplicationConfig = {}) {
    super(options);
    // Set up the custom sequence
    this.sequence(MySequence);


    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));
    // Bind Service so it’s available for injection
    this.dataSource(ProductServiceDataSource);
    this.service(ProductServiceProvider);
    this.dataSource(UserServiceDataSource);
    this.service(UserServiceProvider);
    this.dataSource(OrderServiceDataSource);
    this.service(OrderServiceProvider);
    this.bind('services.NotificationProxyService').toClass(NotificationProxyService);

    this.component(AuthenticationComponent);
    // Mount jwt component
    this.component(JWTAuthenticationComponent);
   
    // Bind TokenService
    this.bind(TokenServiceBindings.TOKEN_SECRET).to(process.env.JWT_SECRET ?? '');
    // this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(Number(process.env.JWT_EXPIRES_IN) ?? 86400);
    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(MyJWTService);

    // this.bind('authentication.actions.authenticate').toProvider(MyAuthenticateActionProvider);
    // AUTHORIZATION CONFIGURATION

    this.component(AuthorizationComponent);
    this.bind('authorizationProviders.role-based-authorizer').toProvider(RoleAuthorizationProvider).tag(AuthorizationTags.AUTHORIZER);
    


    // RATE LIMITER CONFIGURATION
    const redisClient = new Redis({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: Number(process.env.REDIS_PORT) || 6379,
    });

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

     // AUTHENTICATION CONFIGURATION
    // this.component(AuthenticationComponent as any);
    // this.component(JWTAuthenticationComponent);
    // this.bind(AuthenticationBindings.CLIENT_AUTH_ACTION).toProvider(MyAuthenticateActionProvider,);
    // this.bind('security.user').to(AuthenticationBindings.CURRENT_USER);
    // console.log(`Current User : ${AuthenticationBindings.CURRENT_USER}`);
    // registerAuthenticationStrategy(this, JWTStrategy);
    // registerAuthenticationStrategy(this, MyJWTAuthenticationStrategy);

    this.component(AuthorizationComponent);
  }
}

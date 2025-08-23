import { inject, injectable, LifeCycleObserver } from '@loopback/core';
import { del, get, param, patch, post, Request, requestBody, response } from '@loopback/rest';
import { getService } from '@loopback/service-proxy';
import { ProductServiceDataSource } from '../datasources/product-service.datasource';
import { OrderServiceDataSource } from '../datasources/order-service.datasource';
import { UserServiceDataSource } from '../datasources/user-service.datasource';
import { NotificationServiceDataSource } from '../datasources/notification-service.datasource';
import { ProductService } from '../services/product.service.provider';
import { OrderService } from '../services/order.service.provider';
import { UserService } from '../services/user.service.provider';
import { NotificationService } from '../services/notification-service.provider';
import { Order } from '../models/order.model';
import { OrderItem, Product } from '../models';
import { ratelimit } from 'loopback4-ratelimiter';
import { LoginRequest, User } from '../models/user.model';
import { rateLimitKeyGen } from '../utils/rate-limit-keygen.util';
import { authenticate, AuthenticationBindings } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';
import { SecurityBindings } from '@loopback/security'
import { UserProfile } from '../models'
import { SignupRequest, SignupResponse } from '../models/user.dto';

@injectable()
export class StoreFacadeController implements LifeCycleObserver {
  // private productService!: ProductService;
  // private orderService!: OrderService;
  // private userService!: UserService;

  async start(): Promise<void> {
    // Optionally add startup logic here
  }

  async stop(): Promise<void> {
    // Optionally add cleanup logic here
  }

  constructor(
    @inject('datasources.productService')
    protected productDataSource: ProductServiceDataSource,
    @inject('datasources.orderService')
    protected orderDataSource: OrderServiceDataSource,
    @inject('datasources.userService')
    protected userDataSource: UserServiceDataSource,
    @inject('datasources.notificationService')
    protected notificationDataSource: NotificationServiceDataSource,
    @inject('services.ProductService')
    protected productService: ProductService,
    @inject('services.OrderService')
    protected orderService: OrderService,
    @inject('services.UserService')
    protected userService: UserService,
    @inject('services.NotificationService')
    protected notificationService: NotificationService,
    // @inject(SecurityBindings.USER, { optional: true })
    // private user: UserProfile,
    // @inject(AuthenticationBindings.CURRENT_USER) private currentUser: UserProfile
  ) { }

  // async init(): Promise<void> {
  //   this.productService = await getService<ProductService>(this.productDataSource);
  //   this.orderService = await getService<OrderService>(this.orderDataSource);
  //   this.userService = await getService<UserService>(this.userDataSource);
  // }


  // @authenticate('jwt')
  @authorize({
    allowedRoles: ['Admin'],
    voters: ['authorizationProviders.role-based-authorizer'],
  })
  @ratelimit(true, {
    max: 2,       // 🔹 Only 2 requests
    message: 'Too many requests, please try again later.',
    statusCode: 429,
    keyGenerator: rateLimitKeyGen,
  })
  @get('/facade/products/{productId}/orders')
  async getProductWithOrders(
    @param.path.string('productId') productId: string,
  ): Promise<{ product: Product; orders: Order[] }> {
    const productService = await getService<ProductService>(this.productDataSource);
    const orderService = await getService<OrderService>(this.orderDataSource);

    const product = await productService.getProductById(productId);
    if (!product) {
      throw new Error(`Product with id ${productId} not found`);
    }
    const orders = await orderService.getOrdersByProductId(productId);

    return { product, orders };
  }

  @authenticate('jwt')
  @authorize({
    allowedRoles: ['SuperAdmin', 'Subscriber'],
    voters: ['authorizationProviders.role-based-authorizer'],
  })
  @ratelimit(true, {
    max: 2,       // 🔹 Only 2 requests
    message: 'Too many requests, please try again later.',
    statusCode: 429,
    keyGenerator: rateLimitKeyGen,
  })
  @get('facade/users/{userId}/orders', {
    responses: {
      '200': {
        description: 'Aggregated user + orders',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                user: { type: 'object' },
                orders: { type: 'array', items: { type: 'object' } },
              },
            },
          },
        },
      },
    },
  })
  async getOrdersForUser(
    @param.path.string('userId') userId: string,
  ): Promise<{ user: User; orders: Order[] }> {
    // const userService = await getService<UserService>(this.userDataSource);
    // const orderService = await getService<OrderService>(this.orderDataSource);

    // Fetch the user
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }
    // console.log('user:', JSON.stringify(this.user, null, 2));
    // console.log(`currentUser ${this.currentUser}`);

    // Fetch the orders for the user
    const orders = await this.orderService.getOrdersByUserId(userId);
    // Return user after removing userCredentials relation and orders
    const { userCredentials, ...safeUser } = user as User & { userCredentials?: {} };
    return { user: safeUser, orders };
  }


  // @authenticate('jwt')
  // @authorize({ allowedRoles: ['Admin', 'SuperAdmin', 'Subscriber'] })
  // @post('/facade/orders', {
  //   responses: { '200': { description: 'Create new order' } },
  // })
  // async createOrder(
  //   @requestBody() order: Order,
  // ): Promise<Order> {
  //   return this.orderService.createOrder(order);
  // }

  // @authenticate('jwt')
  // @authorize({ allowedRoles: ['Admin', 'SuperAdmin', 'Subscriber'] })
  // @patch('/facade/orders/{id}', {
  //   responses: { '200': { description: 'Update order' } },
  // })
  // async updateOrder(
  //   @param.path.string('id') id: string,
  //   @requestBody() order: Order,
  // ): Promise<Order | null> {
  //   return this.orderService.updateOrder(id, order);
  // }

  // @authenticate('jwt')
  // @authorize({ allowedRoles: ['Admin', 'SuperAdmin', 'Subscriber'] })
  // @del('/facade/orders/{id}', {
  //   responses: { '200': { description: 'Delete order' } },
  // })
  // async deleteOrder(
  //   @param.path.string('id') id: string,
  // ): Promise<boolean> {
  //   return this.orderService.deleteOrder(id);
  // }


  @authenticate.skip()
  @post('/facade/signup')
  @response(201, {
    description: 'Signup new user and send onboarding notification',
  })
  async signup(
    @requestBody() newUser: User,
  ): Promise<User> {
    // Step 1: Call user-service to create new user
    const createdUser: User = await this.userService.signup(newUser);

    // Step 2: Send onboarding notification from notification-service
    await this.notificationService.sendNotification({
      subject: '🎉 Welcome to MyApp!',
      body: `Hi ${createdUser.username}, welcome onboard!`,
      receiver: {
        to: [
          {
            id: createdUser.email,
            name: createdUser.username,
          },
        ],
      },
      type: 0,
      sentDate: new Date().toISOString(),
      options: {},
      isCritical: false,
    });

    return createdUser;
  }

  @authenticate.skip()
  @post('/facade/login')
  @response(200, {
    description: 'Login user and send login notification',
  })
  async login(
    @requestBody() credentials: LoginRequest,
  ): Promise<{ token: string}> {
    // Step 1: Authenticate user via user-service
    const {token} = await this.userService.login(credentials);

    // Step 2: Send login notification
    const timestamp = new Date().toISOString();
    await this.notificationService.sendNotification({
      subject: '🔔 Login Alert',
      body: `Hi you have just logged in at ${timestamp}.`,
      receiver: {
        to: [
          {
            id: credentials.email
          },
        ],
      },
      type: 0,
      sentDate: timestamp,
      options: {},
      isCritical: false,
    });

    return {token};
  }

}
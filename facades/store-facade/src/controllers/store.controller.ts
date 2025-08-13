import { inject, injectable, LifeCycleObserver } from '@loopback/core';
import { get, param, Request } from '@loopback/rest';
import { getService } from '@loopback/service-proxy';
import { ProductServiceDataSource } from '../datasources/product-service.datasource';
import { OrderServiceDataSource } from '../datasources/order-service.datasource';
import { UserServiceDataSource } from '../datasources/user-service.datasource';
import { ProductService } from '../services/product-service.interface';
import { OrderService } from '../services/order-service.interface';
import { UserService } from '../services/user-service.interface';
import { Order } from '../models/order.model';
import { Product } from '../models';
import {ratelimit} from 'loopback4-ratelimiter';
import { User } from '../models/user.model';
import { rateLimitKeyGen } from '../utils/rate-limit-keygen.util';

@injectable()
export class StoreFacadeController implements LifeCycleObserver {
  private productService!: ProductService;
  private orderService!: OrderService;
  private userService!: UserService;

  constructor(
    @inject('datasources.productService')
    protected productDataSource: ProductServiceDataSource,
    @inject('datasources.orderService')
    protected orderDataSource: OrderServiceDataSource,
    @inject('datasources.userService')
    protected userDataSource: UserServiceDataSource,
  ) { }

  async init(): Promise<void> {
    this.productService = await getService<ProductService>(this.productDataSource);
    this.orderService = await getService<OrderService>(this.orderDataSource);
    this.userService = await getService<UserService>(this.orderDataSource);
  }

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

  @ratelimit(true)
  @get('facades/users/{userId}/orders')
  async getOrdersForUser(
    @param.path.string('userId') userId: string,
  ): Promise<{ user: User; orders: Order[] }> {
  const userService = await getService<UserService>(this.userDataSource);
  const orderService = await getService<OrderService>(this.orderDataSource);

  // Fetch the user
  const user = await userService.getUserById(userId);
  if (!user) {
    throw new Error(`User with id ${userId} not found`);
  }

  // Fetch the orders for the user
  const orders = await orderService.getOrdersByUserId(userId);
  return { user, orders };
  }
}
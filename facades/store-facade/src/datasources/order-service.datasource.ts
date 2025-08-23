import { inject, lifeCycleObserver, LifeCycleObserver } from "@loopback/core";
import { juggler } from "@loopback/repository";
import * as dotenv from 'dotenv';
dotenv.config(); // Load .env before anything else

const config = {
  name: 'orderService',
  connector: 'rest',
  baseUrl: process.env.DB_URL || 'http://localhost:3003',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  crud: true,
  operations: [
    // ========== ORDERS ==========
    {
      template: {
        method: 'GET',
        url: '{baseUrl}/orders',
      },
      functions: {
        getAllOrders: [],
      },
    },
    {
      template: {
        method: 'GET',
        url: '{baseUrl}/orders/{id}',
      },
      functions: {
        getOrderById: ['id'],
      },
    },
    {
      template: {
        method: 'POST',
        url: '{baseUrl}/orders',
        body: '{body}',
      },
      functions: {
        createOrder: ['body'],
      },
    },
    {
      template: {
        method: 'PATCH',
        url: '{baseUrl}/orders/{id}',
        body: '{body}',
      },
      functions: {
        updateOrder: ['id', 'body'],
      },
    },
    {
      template: {
        method: 'DELETE',
        url: '{baseUrl}/orders/{id}',
      },
      functions: {
        deleteOrder: ['id'],
      },
    },
    {
      template: {
        method: 'GET',
        url: '{baseUrl}/orders?filter[where][productId]={productId}',
      },
      functions: {
        getOrdersByProductId: ['productId'],
      },
    },
    {
      template: {
        method: 'GET',
        url: '{baseUrl}/orders?filter[where][userId]={userId}',
      },
      functions: {
        getOrdersByUserId: ['userId'],
      },
    },
    // ========== ORDER ITEMS ==========
    {
      template: {
        method: 'GET',
        url: '{baseUrl}/orders/{orderId}/order-items',
      },
      functions: {
        getOrderItems: ['orderId'],
      },
    },
    {
      template: {
        method: 'POST',
        url: '{baseUrl}/orders/{orderId}/order-items',
        body: '{body}',
      },
      functions: {
        createOrderItem: ['orderId', 'body'],
      },
    },
    {
      template: {
        method: 'PATCH',
        url: '{baseUrl}/orders/{orderId}/order-items',
        body: '{body}',
      },
      functions: {
        updateOrderItems: ['orderId', 'body'],
      },
    },
    {
      template: {
        method: 'DELETE',
        url: '{baseUrl}/orders/{orderId}/order-items',
      },
      functions: {
        deleteOrderItems: ['orderId'],
      },
    },
  ],
}

@lifeCycleObserver('datasource')
export class OrderServiceDataSource extends juggler.DataSource implements LifeCycleObserver {
  static dataSourceName = 'orderService';

  constructor(
    @inject('datasources.config.orderService', { optional: true })
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
import { inject, lifeCycleObserver, LifeCycleObserver } from "@loopback/core";
import { juggler } from "@loopback/repository";
import * as dotenv from 'dotenv';
dotenv.config(); // Load .env before anything else

const config = {
  name: 'orderService',
  connector: 'rest',
  baseUrl: process.env.DB_URL || 'http://localhost:3003',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  operations: [
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
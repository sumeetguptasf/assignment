import { inject, lifeCycleObserver, LifeCycleObserver } from "@loopback/core";
import { juggler } from "@loopback/repository";

  const config = {
  name: 'productService',
  connector: 'rest',
  baseUrl: process.env.PRODUCT_SERVICE_URL || 'http://localhost:3001',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  crud: true,
  operations: [
    {
      template: {
        method: 'GET',
        url: '{baseUrl}/products/{productId}/orders',
      },
      functions: {
        getOrdersForProduct: ['productId'],
      },
    },
    {
      template: {
        method: 'GET',
        url: '{baseUrl}/products',
      },
      functions: {
        getAllProducts: [],
      },
    },
    {
      template: {
        method: 'GET',
        url: '{baseUrl}/products/{id}',
      },
      functions: {
        getProductById: ['id'],
      },
    },
    {
      template: {
        method: 'POST',
        url: '{baseUrl}/products',
        body: '{body}',
      },
      functions: {
        createProduct: ['body'],
      },
    },
    {
      template: {
        method: 'PUT',
        url: '{baseUrl}/products/{id}',
        body: '{body}',
      },
      functions: {
        updateProduct: ['id', 'body'],
      },
    },
    {
      template: {
        method: 'DELETE',
        url: '{baseUrl}/products/{id}',
      },
      functions: {
        deleteProduct: ['id'],
      },
    },
  ],
};
@lifeCycleObserver('datasource')
export class ProductServiceDataSource extends juggler.DataSource implements LifeCycleObserver {
  static dataSourceName = 'productService';

  constructor(
    @inject('datasources.config.productService', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
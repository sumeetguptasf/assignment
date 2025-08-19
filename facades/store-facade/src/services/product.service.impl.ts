import {injectable, inject} from '@loopback/core';
import {Product} from '../models/product.model';
import {ProductService} from './product.service.provider';
import {ProductServiceDataSource} from '../datasources/product-service.datasource';

@injectable()
export class ProductServiceImpl implements ProductService {
  constructor(
    @inject('datasources.productService')
    private productServiceDS: ProductServiceDataSource & {
      getAllProducts: () => Promise<Product[]>;
      getProductById: (id: string) => Promise<Product>;
      createProduct: (body: Product) => Promise<Product>;
      updateProduct: (id: string, body: Product) => Promise<Product>;
      deleteProduct: (id: string) => Promise<void>;
    },
  ) {}

  getAllProducts() {
    return this.productServiceDS.getAllProducts();
  }

  getProductById(id: string) {
    return this.productServiceDS.getProductById(id);
  }

  createProduct(product: Product) {
    return this.productServiceDS.createProduct(product);
  }

  updateProduct(id: string, product: Product) {
    return this.productServiceDS.updateProduct(id, product);
  }

  async deleteProduct(id: string) {
    await this.productServiceDS.deleteProduct(id);
    return true;
  }
}
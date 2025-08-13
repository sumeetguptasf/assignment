import {get, post, put, del, param, requestBody} from '@loopback/rest';
import {inject} from '@loopback/core';
import {ProductService} from '../services/product.service.interface';
import {Product} from '../models/product.model';

export class ProductFacadeController {
  constructor(
    @inject('services.ProductService') private productService: ProductService,
  ) {}

  @get('facade/products')
  getAllProducts() {
    return this.productService.getAllProducts();
  }

  @get('facade/products/{id}')
  getProductById(@param.path.string('id') id: string) {
    return this.productService.getProductById(id);
  }

  @post('facade/products')
  createProduct(@requestBody() product: Product) {
    return this.productService.createProduct(product);
  }

  @put('facade/products/{id}')
  updateProduct(@param.path.string('id') id: string, @requestBody() product: Product) {
    return this.productService.updateProduct(id, product);
  }

  @del('facade/products/{id}')
  deleteProduct(@param.path.string('id') id: string) {
    return this.productService.deleteProduct(id);
  }
}
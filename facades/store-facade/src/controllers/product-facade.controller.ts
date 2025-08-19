import { get, post, put, del, param, requestBody } from '@loopback/rest';
import { inject } from '@loopback/core';
import { ProductService } from '../services/product.service.provider';
import { Product } from '../models/product.model';
import { authorize } from '@loopback/authorization';
import { authenticate } from '@loopback/authentication';


const ProductSchema = {
  type: 'object',
  properties: {
    id: {type: 'string'},
    name: {type: 'string'},
    price: {type: 'number'},
  },
  required: ['name', 'price'],
} as const;

export class ProductFacadeController {
  constructor(
    @inject('services.ProductService') private productService: ProductService,
  ) { }

  @authenticate('jwt')
  @authorize({
    allowedRoles: ['SuperAdmin', 'Admin', 'Subscriber'],
    voters: ['authorizationProviders.role-based-authorizer'],
  })
  @get('facade/products')
  getAllProducts() {
    return this.productService.getAllProducts();
  }

  @authenticate('jwt')
  @authorize({
    allowedRoles: ['SuperAdmin', 'Admin', 'Subscriber'],
    voters: ['authorizationProviders.role-based-authorizer'],
  })
  @get('facade/products/{id}')
  getProductById(@param.path.string('id') id: string) {
    return this.productService.getProductById(id);
  }
  @authenticate('jwt')
  @authorize({
    allowedRoles: ['SuperAdmin'],
    voters: ['authorizationProviders.role-based-authorizer'],
  })
  @post('facade/products')
  createProduct(@requestBody() product: Product) {
    return this.productService.createProduct(product);
  }

  @authenticate('jwt')
  @authorize({
    allowedRoles: ['SuperAdmin'],
    voters: ['authorizationProviders.role-based-authorizer'],
  })
  @put('facade/products/{id}')
  updateProduct(@param.path.string('id') id: string, @requestBody() product: Product) {
    return this.productService.updateProduct(id, product);
  }

  @authenticate('jwt')
  @authorize({
    allowedRoles: ['SuperAdmin'],
    voters: ['authorizationProviders.role-based-authorizer'],
  })
  @del('facade/products/{id}')
  deleteProduct(@param.path.string('id') id: string) {
    return this.productService.deleteProduct(id);
  }
}
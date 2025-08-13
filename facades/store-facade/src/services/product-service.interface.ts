import { Order } from '../models/order.model';
import { Product } from '../models/product.model';

export interface ProductService {
  getAllProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | null>;
  createProduct(product: Product): Promise<Product>;
  updateProduct(id: string, product: Product): Promise<Product | null>;
  deleteProduct(id: string): Promise<boolean>;
  /**
   * Retrieves orders associated with a specific product.
   * @param productId - The ID of the product for which to retrieve orders.
   * @returns A promise that resolves to an array of orders related to the specified product.
   */
  // getOrdersForProduct(productId: string): Promise<Order[]>; // this is not in the original interface, but added for clarity
}

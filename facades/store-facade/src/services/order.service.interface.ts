import { Order } from '../models/order.model';
import { OrderItem } from '../models/order-item.model';

export interface OrderService {
  getAllOrders(): Promise<Order[]>;
  getOrderById(id: string): Promise<Order | null>;
  createOrder(order: Order): Promise<Order>;
  updateOrder(id: string, order: Order): Promise<Order | null>;
  deleteOrder(id: string): Promise<boolean>;
  getOrderItems(orderId: string): Promise<OrderItem[]>;
  createOrderItem(orderItem: OrderItem): Promise<OrderItem>;
  updateOrderItem(id: string, orderItem: OrderItem): Promise<OrderItem | null>;
  deleteOrderItem(id: string): Promise<boolean>;
  /**
   * Retrieves all orders associated with a specific product.
   * @param productId - The ID of the product for which to retrieve orders.
   * @param userId - The ID of the user for which to retrieve orders.
   * @returns A promise that resolves to an array of orders related to the specified product.
   */
  getOrdersByUserId(userId: string): Promise<Order[]>;
  getOrdersByProductId(productId: string): Promise<Order[]>;
}
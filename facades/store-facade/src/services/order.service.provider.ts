import { inject, Provider } from '@loopback/core';
import { OrderServiceDataSource } from '../datasources';
import { Order, OrderItem } from '../models';

export interface OrderService {
    // Orders
    getAllOrders(): Promise<Order[]>;
    getOrderById(id: string): Promise<Order | null>;
    createOrder(order: Order): Promise<Order>;
    updateOrder(id: string, order: Order): Promise<Order | null>;
    deleteOrder(id: string): Promise<boolean>;

    getOrdersByUserId(userId: string): Promise<Order[]>;
    getOrdersByProductId(productId: string): Promise<Order[]>;

    // Order Items
    getOrderItems(orderId: string): Promise<OrderItem[]>;
    createOrderItem(orderId: string, orderItem: OrderItem): Promise<OrderItem>;
    updateOrderItems(orderId: string, orderItem: Partial<OrderItem>): Promise<OrderItem | null>;
    deleteOrderItems(orderId: string): Promise<boolean>;
}

export class OrderServiceProvider implements Provider<OrderService> {
    constructor(
        @inject('datasources.orderService')
        protected dataSource: OrderServiceDataSource = new OrderServiceDataSource(),
      ) {}
    
      value(): OrderService {
        return (this.dataSource as any);
      }
    }

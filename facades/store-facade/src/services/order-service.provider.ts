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
    updateOrderItems(orderId: string, orderItem: Partial<OrderItem>): Promise<boolean>;
    deleteOrderItems(orderId: string): Promise<boolean>;
}

export class OrderServiceProvider implements Provider<OrderService> {
    constructor(
        @inject('datasources.orderService')
        protected dataSource: OrderServiceDataSource = new OrderServiceDataSource(),
    ) { }

    value(): OrderService {
        const ds: any = this.dataSource;

        return {
            // Orders
            getAllOrders: () => ds.DataSourceName.getAllOrders(),
            getOrderById: (id: string) => ds.DataSourceName.getOrderById(id),
            createOrder: (order: Order) => ds.DataSourceName.createOrder(order),
            updateOrder: (id: string, order: Order) => ds.DataSourceName.updateOrder(id, order),
            deleteOrder: (id: string) => ds.DataSourceName.deleteOrder(id),


            getOrdersByUserId: (userId: string) => ds.DataSourceName.getOrdersByUserId(userId),
            getOrdersByProductId: (productId: string) => ds.DataSourceName.getOrdersByProductId(productId),

            // Order Items
            getOrderItems: (orderId: string) => ds.DataSourceName.getOrderItems(orderId),
            createOrderItem: (orderId: string, orderItem: OrderItem) =>
                ds.DataSourceName.createOrderItem(orderId, orderItem),
            updateOrderItems: (orderId: string, orderItem: Partial<OrderItem>) =>
                ds.DataSourceName.updateOrderItems(orderId, orderItem),
            deleteOrderItems: (orderId: string) => ds.DataSourceName.deleteOrderItems(orderId),
        };
    }
}
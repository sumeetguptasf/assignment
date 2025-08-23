import { get, post, put, del, param, requestBody, patch } from '@loopback/rest';
import { inject } from '@loopback/core';
import { OrderService } from '../services/order.service.provider';
import { Order } from '../models/order.model';
import { authorize } from '@loopback/authorization';
import { authenticate } from '@loopback/authentication';
import { OrderItem } from '../models';

// const OrderSchema = {
//   type: 'object',
//   properties: {
//     id: {type: 'string'},
//     productId: {type: 'string'},
//     quantity: {type: 'number'},
//     userId: {type: 'string'},
//   },
//   required: ['productId', 'quantity', 'userId'],
// } as const;

export class OrderFacadeController {
    constructor(
        @inject('services.OrderService') private orderService: OrderService,
    ) { }

    @authenticate('jwt')
    @authorize({
        allowedRoles: ['SuperAdmin', 'Admin', 'Subscriber'],
        voters: ['authorizationProviders.role-based-authorizer'],
    })
    @get('facade/orders')
    getAllOrders() {
        return this.orderService.getAllOrders();
    }

    @authenticate('jwt')
    @authorize({
        allowedRoles: ['SuperAdmin', 'Admin', 'Subscriber'],
        voters: ['authorizationProviders.role-based-authorizer'],
    })
    @get('facade/orders/{id}')
    getOrderById(@param.path.string('id') id: string) {
        return this.orderService.getOrderById(id);
    }

    @authenticate('jwt')
    @authorize({
        allowedRoles: ['SuperAdmin', 'Admin', 'Subscriber'],
        voters: ['authorizationProviders.role-based-authorizer'],
    })
    @post('facade/orders')
    createOrder(@requestBody() order: Order) {
        console.log(`Creating Order : ${order}`)
        return this.orderService.createOrder(order);
    }

    @authenticate('jwt')
    @authorize({
        allowedRoles: ['SuperAdmin', 'Admin'],
        voters: ['authorizationProviders.role-based-authorizer'],
    })
    @put('facade/orders/{id}')
    updateOrder(@param.path.string('id') id: string, @requestBody() order: Order) {
        return this.orderService.updateOrder(id, order);
    }

    @authenticate('jwt')
    @authorize({
        allowedRoles: ['SuperAdmin'],
        voters: ['authorizationProviders.role-based-authorizer'],
    })
    @del('facade/orders/{id}')
    deleteOrder(@param.path.string('id') id: string) {
        return this.orderService.deleteOrder(id);
    }


    // ------------------- ORDER ITEMS -------------------

    @authenticate('jwt')
    @authorize({ allowedRoles: ['Admin', 'SuperAdmin', 'Subscriber'] })
    @get('/facade/orders/{orderId}/items')
    async getOrderItems(
        @param.path.string('orderId') orderId: string,
    ): Promise<OrderItem[]> {
        return this.orderService.getOrderItems(orderId);
    }

    @authenticate('jwt')
    @authorize({ allowedRoles: ['Admin', 'SuperAdmin', 'Subscriber'] })
    @post('/facade/orders/{orderId}/items')
    async createOrderItem(
        @param.path.string('orderId') orderId: string,
        @requestBody() orderItem: OrderItem,
    ): Promise<OrderItem> {
        return this.orderService.createOrderItem(orderId, orderItem);
    }

    @authenticate('jwt')
    @authorize({ allowedRoles: ['Admin', 'SuperAdmin', 'Subscriber'] })
    @patch('/facade/orders/{orderId}/items')
    async updateOrderItems(
        @param.path.string('orderId') orderId: string,
        @requestBody() orderItem: Partial<OrderItem>,
    ): Promise<OrderItem | null> {
        // Ensure orderId is set and is a string
        const updatedOrderItem: OrderItem = {
            ...orderItem,
            orderId: orderId,
        } as OrderItem;
        return this.orderService.updateOrderItems(orderId, updatedOrderItem);
    }

    // @authenticate('jwt')
    // @authorize({
    //     allowedRoles: ['Admin', 'SuperAdmin', 'Subscriber'],
    //     voters: ['authorizationProviders.role-based-authorizer'],
    // })
    // @put('/facade/orders/{orderId}/items')
    // async updateOrderItems(
    //     @param.path.string('orderId') orderId: string,
    //     @requestBody() orderItem: Partial<OrderItem>,
    // ): Promise<OrderItem | null> {
    //     // Ensure the orderId is passed down to the service
    //     return this.orderService.updateOrderItems(orderId, orderItem);
    // }

    @authenticate('jwt')
    @authorize({ allowedRoles: ['Admin', 'SuperAdmin', 'Subscriber'] })
    @del('/facade/orders/{orderId}/items')
    async deleteOrderItems(
        @param.path.string('orderId') orderId: string,
    ): Promise<boolean> {
        return this.orderService.deleteOrderItems(orderId);
    }
}
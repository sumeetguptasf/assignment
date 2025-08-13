import { belongsTo, Entity, model, property } from '@loopback/repository';
import { Order } from './order.model';

@model({
  settings: {
    strict: true,
    postgresql: {
      table: 'order_items',
    },
  },
})
export class OrderItem extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @belongsTo(() => Order, {
    name: 'order',
    keyFrom: 'orderId',
    keyTo: 'id',
  }, {
    postgresql: {
      columnName: 'order_id',
    },
  })
  orderId: string;

  @property({
    type: 'string',
    required: true,
    postgresql: {
      columnName: 'product_id',
    },
  })
  productId: string;

  @property({ 
    type: 'string',
    postgresql: {
      columnName: 'product_name',
    },
  })
  productName?: string;

  @property({
    type: 'number',
    required: true,
  })
  quantity: number;

  @property({
    type: 'number',
    required: true,
    postgresql: {
      columnName: 'unit_price',
    },
  })
  unitPrice: number;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<OrderItem>) {
    super(data);
  }
}

export interface OrderItemRelations {
  // describe navigational properties here
}

export type OrderItemWithRelations = OrderItem & OrderItemRelations;

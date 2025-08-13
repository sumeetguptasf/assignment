import { Entity, hasMany, model, property } from '@loopback/repository';
import { OrderItem } from './order-item.model';

@model({
  settings: {
    strict: true,
    postgresql: {
      table: 'orders',
    },
  },
})
export class Order extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
    postgresql: {
      columnName: 'user_id',
    },
  })
  userId: string;

  @property({
    type: 'string',
    jsonSchema: {
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    },
    default: 'Pending',
  })
  status: string;

  @property({
    type: 'number',
    required: true,
    postgresql: {
      columnName: 'total_amount',
    },
  })
  totalAmount: number;

  @property({
    type: 'date',
    defaultFn: 'now',
    postgresql: {
      columnName: 'created_at',
    },
  })
  created_at?: string;

  @hasMany(() => OrderItem, { keyTo: 'orderId' })
  items: OrderItem[];

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // [prop: string]: any;

  constructor(data?: Partial<Order>) {
    super(data);
  }
}

export interface OrderRelations {
  // describe navigational properties here
}

export type OrderWithRelations = Order & OrderRelations;

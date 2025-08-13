import { Entity, model, property } from '@loopback/repository';

@model({
  settings: {
    strict: true,
    postgresql: {
      table: 'products',
    },
  },
})
export class Product extends Entity {
  @property({
    type: 'string',
    id: true,
    defaultFn: 'uuidv4', // dont use generated: true as it does not work with defaultFn
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    default: 'NO DESC',
  })
  description?: string;

  @property({
    type: 'number',
    required: true,
  })
  price: number;

  @property({
    type: 'boolean',
    default: true,
  })
  inStock?: boolean;

  @property({
    type: 'date',
    defaultFn: 'now',
  })
  created_at?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Product>) {
    super(data);
  }
}

export interface ProductRelations {
  // describe navigational properties here
}

export type ProductWithRelations = Product & ProductRelations;

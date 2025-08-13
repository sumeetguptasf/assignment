import {Entity, model, property} from '@loopback/repository';

@model()
export class Usercredentials extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  userid: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;


  constructor(data?: Partial<Usercredentials>) {
    super(data);
  }
}

export interface UsercredentialsRelations {
  // describe navigational properties here
}

export type UsercredentialsWithRelations = Usercredentials & UsercredentialsRelations;

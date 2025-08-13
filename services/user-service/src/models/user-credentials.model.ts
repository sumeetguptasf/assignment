import { belongsTo, Entity, model, property } from '@loopback/repository';
import { User } from './user.model';

@model()
export class UserCredentials extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    defaultFn: 'uuidv4',
  })
  id?: string;

  // @property({
  //   type: 'string',
  //   required: true,
  // })
  // userId: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  
  @belongsTo(() => User,{
    name: 'user', // optional navigational name
    keyFrom: 'userId', // property in this model
    keyTo: 'id', // property in User model
  })
  userId: string;

  constructor(data?: Partial<UserCredentials>) {
    super(data);
  }
}

export interface UserCredentialsRelations {
  // describe navigational properties here
}

export type UserCredentialsWithRelations = UserCredentials & UserCredentialsRelations;

import { Entity, hasOne, model, property } from '@loopback/repository';
import { UserCredentials } from './user-credentials.model';

@model({
  settings: {
    strict: true,
    postgresql: {
      table: 'users',
    },
  },
})
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
    defaultFn: 'uuidv4', // dont use generated: true as it does not work with defaultFn
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
    postgresql: {
      columnName: 'username',
      dataType: 'varchar',
      dataLength: 255,
      unique: true,
    },
  })
  username: string;

  @property({
    type: 'string',
    required: true,
  })
  firstName: string;

  @property({
    type: 'string',
  })
  middleName?: string;

  @property({
    type: 'string',
    required: true,
  })
  lastName: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  phone: string;

  @property({
    type: 'string',
    required: true,
  })
  address: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: ['SuperAdmin', 'Admin', 'Subscriber'],
    },
    postgresql: {
      columnName: 'role',
      dataType: 'user_role',
    },
    default: 'Subscriber',
  })
  role: 'SuperAdmin' | 'Admin' | 'Subscriber';

  @hasOne(() => UserCredentials)
  userCredentials: UserCredentials;

  @property({
    type: 'date',
    defaultFn: 'now',
    postgresql: {
      columnName: 'created_at',
      dataType: 'timestamp with time zone',
    },
  })
  created_at?: string;

  @property({
    type: 'date',
    postgresql: {
      columnName: 'updated_at',
      dataType: 'timestamp with time zone',
    },
  })
  updated_at?: string;

  [prop: string]: any;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;

import {model, property} from '@loopback/repository';

@model()
export class UserDto {
  @property({type: 'string', id: true})
  id?: string;

  @property({type: 'string', required: true})
  username: string;

  @property({type: 'string', required: true})
  email: string;

  @property({type: 'string', required: true})
  password: string;

  @property({type: 'string'})
  role?: string;
}

@model()
export class LoginDto {
  @property({type: 'string', required: true})
  email: string;

  @property({type: 'string', required: true})
  password: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  id: string;
  username: string;
  email: string;
}
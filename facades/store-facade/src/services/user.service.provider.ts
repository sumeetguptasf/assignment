import {inject, Provider} from '@loopback/core';
import {UserServiceDataSource} from '../datasources';
import { LoginRequest, LoginResponse, User } from '../models';

export interface UserService {
  signup(user: User): Promise<User>;
  login(LoginRequest: LoginRequest): Promise<LoginResponse>;
  getUserById(id: string): Promise<object>;
  updateUser(id: string, body: object): Promise<object>;
  deleteUser(id: string): Promise<object>;
  findAll(): Promise<object[]>;
}

export class UserServiceProvider implements Provider<UserService> {
  constructor(
    @inject('datasources.userService')
    protected dataSource: UserServiceDataSource = new UserServiceDataSource(),
  ) {}

  value(): UserService {
    return (this.dataSource as any);
  }
}
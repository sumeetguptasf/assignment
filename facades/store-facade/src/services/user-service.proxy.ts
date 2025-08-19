import {injectable, BindingScope} from '@loopback/core';
import axios from 'axios';
import {UserDto, LoginDto} from '../models/user.dto';

@injectable({scope: BindingScope.TRANSIENT})
export class UserServiceProxy {
  private baseUrl = process.env.USER_SERVICE_URL ?? 'http://localhost:3000';

  async signup(newUser: UserDto): Promise<UserDto> {
    const res = await axios.post(`${this.baseUrl}/users/signup`, newUser);
    return res.data;
  }

  async login(creds: LoginDto): Promise<object> {
    const res = await axios.post(`${this.baseUrl}/users/login`, creds);
    return res.data;
  }

  async getById(id: string): Promise<UserDto> {
    const res = await axios.get(`${this.baseUrl}/users/${id}`);
    return res.data;
  }

  async updateUser(id: string, user: Partial<UserDto>): Promise<void> {
    await axios.patch(`${this.baseUrl}/users/${id}`, user);
  }

  async deleteUser(id: string): Promise<void> {
    await axios.delete(`${this.baseUrl}/users/${id}`);
  }

  async findAll(): Promise<UserDto[]> {
    const res = await axios.get(`${this.baseUrl}/users`);
    return res.data;
  }
}
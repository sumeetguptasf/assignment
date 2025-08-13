import {OrderItem} from './order-item.model';

export interface Order {
  id?: string;
  userId: string;
  status: string;
  totalAmount: number;
  createdAt?: string;
  items?: OrderItem[];
}
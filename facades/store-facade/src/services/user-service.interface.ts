import { Order } from '../models/order.model';
import { User } from '../models/user.model';

export interface UserService {
    getUserById(id: string): Promise<User | null>;
    getOrdersByUserId(userId: string): Promise<Order[]>;
    createUser(user: User): Promise<User>;
    updateUser(id: string, user: User): Promise<User | null>;
    deleteUser(id: string): Promise<boolean>;
    getAllUsers(): Promise<User[]>;
    getUserByEmail(email: string): Promise<User | null>;
    authenticateUser(email: string, password: string): Promise<User | null>;
    changePassword(userId: string, oldPassword: string, newPassword: string): Promise<boolean>;
    resetPassword(email: string): Promise<boolean>;
}
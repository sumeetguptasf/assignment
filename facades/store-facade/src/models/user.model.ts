import { IAuthUser } from 'loopback4-authorization';
import { UserCredentials } from './user-credentials.model';
import { Principal, securityId } from '@loopback/security';

export interface User extends IAuthUser{
  id?: string;
  username: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email: string;
  role: string;
  userCredentials?: UserCredentials;
  created_at?: string;
  updated_at?: string;
}

export interface UserDTO {
  id?: string;
  username: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email: string;
  phone: string;
  address: string;
  createdAt?: string;
  updatedAt?: string;
}
export interface UserProfile extends Principal {
  [securityId]: string;
  id: string;
  username: string;
  role: string;
  email: string;
}
export interface LoginRequest {
  email: string;
  password: string;
}
export interface LoginResponse {
  token: string;
}
export function createUserProfile(payload: any): UserProfile {
  return {
    [securityId]: payload.id ?? '',
    id: payload.id,
    email: payload.email,
    username: payload.username,
    role: payload.role,
  }
}
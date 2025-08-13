import { UserCredentials } from './user-credentials.model';

export interface User {
  id?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email: string;
  name: string;
  userCredentials?: UserCredentials;
  created_at?: string;
  updated_at?: string;
}
export interface UserDTO {
  id?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}
export interface UserProfile {
  id: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

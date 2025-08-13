export interface User {
  id?: string;
  email: string;
  password: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}
export interface UserDTO {
  id?: string;
  email: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}
import { IAuthUser } from 'loopback4-authorization';


export interface UserProfile {
  // [securityId]: string;
  id: string;
  username: string;
  role: string;
  email: string;
}
export function createUserProfile(payload: any): UserProfile {
  return {
    // [securityId]: payload.id ?? '',
    id: payload.id,
    email: payload.email,
    username: payload.username,
    role: payload.role,
  }
}
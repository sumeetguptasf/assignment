import { Principal, securityId } from "@loopback/security";

export interface UserProfile extends Principal {
    [securityId]: string;
    email?: string;
    username?: string;
    id?: string;
    role?: string;
}
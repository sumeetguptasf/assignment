import {AuthorizationMetadata} from '@loopback/authorization';

export interface PermissionMetadata extends AuthorizationMetadata {
  permissions?: string[];
  resource?: string;
}
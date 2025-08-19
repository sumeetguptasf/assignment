import {
  AuthorizationContext,
  AuthorizationDecision,
  AuthorizationMetadata,
  Authorizer,
} from '@loopback/authorization';
import {Provider} from '@loopback/core';
import {UserProfile} from '@loopback/security';

export class RoleAuthorizationProvider implements Provider<Authorizer> {
  value(): Authorizer {
    return this.authorize.bind(this);
  }

  async authorize(
    authorizationCtx: AuthorizationContext,
    metadata: AuthorizationMetadata,
  ): Promise<AuthorizationDecision> {
    // Get the current user from authorizationCtx
    const user: UserProfile | undefined = authorizationCtx.principals[0];

    if (!user) {
      return AuthorizationDecision.DENY;
    }

    // Extract roles from user (adjust this based on how you store roles)

    // User has only a single role
    const userRole = (user as any).role;

    // Get allowed roles from @authorize() decorator
    const allowedRoles = metadata.allowedRoles ?? [];

    if (allowedRoles.includes(userRole)) {
      return AuthorizationDecision.ALLOW;
    }

    return AuthorizationDecision.DENY;
  
  }
}
import {
    AuthorizationContext,
    AuthorizationDecision,
} from '@loopback/authorization';
import { BindingScope, Provider, inject, injectable } from '@loopback/core';
import { UserProfile } from '../models/user.model';
import { RolePermissions } from './role-permissions';
import { PermissionMetadata } from './permission-metadata';


@injectable({ scope: BindingScope.TRANSIENT })
export class RolePermissionAuthorizerProvider implements Provider<(context: AuthorizationContext, metadata: PermissionMetadata) => Promise<AuthorizationDecision>> {
    constructor(
        @inject.context() private ctx: any,
        @inject('authentication.currentUser', { optional: true })
        private currentUser: UserProfile,
    ) { }

    value() {
        return this.authorize.bind(this);
    }

    async authorize(
        authorizationCtx: AuthorizationContext,
        metadata: PermissionMetadata,
    ): Promise<AuthorizationDecision> {
        console.log(`Current user: ${this.currentUser}`)
        if (!this.currentUser) return AuthorizationDecision.DENY;
        console.log(`Current user: ${this.currentUser.username}, Role: ${this.currentUser.role}`);

        const requiredPermissions = (metadata as PermissionMetadata).permissions ?? [];
        const role = this.currentUser.role as keyof typeof RolePermissions;

        if (!role || !RolePermissions[role]) return AuthorizationDecision.DENY;

        const rolePermissions = RolePermissions[role];

        const hasAllPermissions = requiredPermissions.every(p =>
            rolePermissions.includes(p),
        );

        console.log(`User role: ${role}, Required permissions: ${requiredPermissions.join(', ')}, Has all permissions: ${hasAllPermissions}`);

        return hasAllPermissions ? AuthorizationDecision.ALLOW : AuthorizationDecision.DENY;
    }
}
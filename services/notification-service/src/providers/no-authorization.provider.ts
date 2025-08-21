// import {Provider} from '@loopback/core';
// import {AuthorizationContext, AuthorizationDecision, Authorizer} from '@loopback4/authorization';

// export class NoopAuthorizerProvider implements Provider<Authorizer> {
//   value(): Authorizer {
//     return async (
//       authorizationCtx: AuthorizationContext,
//     ): Promise<AuthorizationDecision> => {
//       // Always allow
//       return AuthorizationDecision.ALLOW;
//     };
//   }
// }
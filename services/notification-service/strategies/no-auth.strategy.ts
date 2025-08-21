// import {AuthenticationStrategy} from 'loopback4-authentication';
// import {Request} from '@loopback/rest';
// import {UserProfile} from '@loopback/security';

// class NoAuthStrategy implements AuthenticationStrategy {
//   name = 'bearer'; // override the same name used by controllers
//   async authenticate(_req: Request): Promise<UserProfile | undefined> {
//     return {id: 'system'};
//   }
// }
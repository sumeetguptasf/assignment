import { Provider } from '@loopback/context';
import {AuthenticateFn, AuthenticationBindings} from 'loopback4-authentication';

export class NoAuthProvider implements Provider<AuthenticateFn<any>>{
  value() {
    // matches AuthenticateFn signature
    return async () => undefined;
  }
}
import {AuthenticationStrategy} from '@loopback/authentication';
import {Request} from '@loopback/rest';
import {UserProfile, securityId} from '@loopback/security';
import * as jwt from 'jsonwebtoken';

export class JWTAuthenticationStrategy implements AuthenticationStrategy {
  name = 'jwt';

  async authenticate(request: Request): Promise<UserProfile | undefined> {
    const token: string = this.extractCredentials(request);
    const secret = process.env.JWT_SECRET || '';
    const decoded = jwt.verify(token, secret) as any;

    return {
      [securityId]: decoded.id,
      id: decoded.id,
      email: decoded.email,
      username: decoded.username,
      role: decoded.role,
    };
  }

  extractCredentials(request: Request): string {
    const authHeader: string = request.headers.authorization ?? '';
    if (!authHeader.startsWith('Bearer ')) {
      throw new Error('Authorization header not found.');
    }
    return authHeader.substring(7);
  }
}
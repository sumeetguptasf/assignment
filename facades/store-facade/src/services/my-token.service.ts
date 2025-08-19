import { securityId } from '@loopback/security';
import { verify } from 'jsonwebtoken';
import jwt, { SignOptions } from 'jsonwebtoken';
import { injectable, inject } from '@loopback/core';
import { TokenServiceBindings } from '@loopback/authentication-jwt';
import { UserProfile } from '../models/user.model';

@injectable()
export class MyJWTService {
    constructor(
        @inject(TokenServiceBindings.TOKEN_SECRET)
        private jwtSecret: string,
        @inject(TokenServiceBindings.TOKEN_EXPIRES_IN)
        private expiresIn: string,
    ) { }

    async getTokenUserProfile(userProfile: UserProfile): Promise<UserProfile> {
        // explicitly pick the fields you want in JWT
        const payload = {
            [securityId]: userProfile.id?.toString() ?? '',
            id: userProfile.id,
            email: userProfile.email,
            username: userProfile.username,
            role: userProfile.role ?? '',
        };
        return payload;
    }

    async generateToken(userProfile: UserProfile): Promise<string> {
        // explicitly pick the fields you want in JWT
        const payload = {
            id: userProfile.id,
            email: userProfile.email,
            username: userProfile.username,
            role: userProfile.role ?? '',
        };
        const options: SignOptions = { expiresIn: Number(process.env.JWT_EXPIRES_IN) ?? "86400" };

        const token = jwt.sign(payload, this.jwtSecret, options);
        return token;
    }

    async verifyToken(token: string): Promise<UserProfile> {
        const payload = verify(token, this.jwtSecret) as any;
        console.log(`[verify token] payload : ${JSON.stringify(payload)}`)
        return {
            [securityId]: payload.id,
            id: payload.id,
            email: payload.email,
            username: payload.username,
            role: payload.role,
        };
    }
}
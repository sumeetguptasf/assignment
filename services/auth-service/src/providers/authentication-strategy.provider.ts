// import {KeycloakStrategy} from 'passport-keycloak-oauth2-oidc';
// import {StrategyAdapter} from 'loopback4-authentication';

// const strategy = new KeycloakStrategy(
//   {
//     clientID: process.env.KEYCLOAK_CLIENT_ID!,
//     clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
//     realm: process.env.KEYCLOAK_REALM!,
//     authServerURL: process.env.KEYCLOAK_HOST!,
//     callbackURL: process.env.KEYCLOAK_CALLBACK_URL!,
//   },
//   (accessToken, refreshToken, profile, done) => {
//     return done(null, profile);
//   }
// );

// return new StrategyAdapter(strategy, 'oauth2', this.userService);
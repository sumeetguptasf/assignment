import { BootMixin } from '@loopback/boot';
import { ApplicationConfig } from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import { RepositoryMixin } from '@loopback/repository';
import { RestApplication } from '@loopback/rest';
import { ServiceMixin } from '@loopback/service-proxy';
import { AuthenticationComponent } from '@loopback/authentication';
import {
  JWTAuthenticationComponent,
  JWTService,
  TokenServiceBindings,
  UserServiceBindings,
} from '@loopback/authentication-jwt';
import { UserCredentialsRepository, UserRepository } from './repositories';
import { MyUserService } from './services';
import path from 'path';
import { MySequence } from './sequence';
import { DbDataSource } from './datasources';


export { ApplicationConfig };

export class UserServiceApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    this.component(RestExplorerComponent);

    this.component(AuthenticationComponent);
    // Mount jwt component
    this.component(JWTAuthenticationComponent);

    // Bind TokenService
    this.bind(TokenServiceBindings.TOKEN_SECRET).to(process.env.JWT_SECRET ?? '');
    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(process.env.JWT_EXPIRES_IN ?? '86400');
    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTService);

    // Bind UserService
    this.bind(UserServiceBindings.USER_SERVICE).toClass(MyUserService as any);
    // Bind user and credentials repository
    this.bind(UserServiceBindings.USER_REPOSITORY).toClass(UserRepository);
    this.bind(UserServiceBindings.USER_CREDENTIALS_REPOSITORY).toClass(
      UserCredentialsRepository,
    );
    // this.bind(SecurityBindings.USER, User);
    this.dataSource(DbDataSource, UserServiceBindings.DATASOURCE_NAME);


    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}

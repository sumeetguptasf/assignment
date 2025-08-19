import {
  post,
  get,
  patch,
  del,
  requestBody,
  param,
  RestBindings,
  RequestContext,
} from '@loopback/rest';
import {inject, service} from '@loopback/core';
import {authenticate, AuthenticationBindings} from '@loopback/authentication';
import {securityId} from '@loopback/security';
import {UserService, UserServiceProvider} from '../services/user-service.provider';
import { UserProfile } from '../models';

export class UserFacadeController {
  constructor(
    @inject(RestBindings.Http.CONTEXT)
    private requestCtx: RequestContext,
    @service(UserServiceProvider) private userService: UserService,
    @inject(AuthenticationBindings.CURRENT_USER, {optional: true}) private currentUser : UserProfile,
  ) {}

  @post('/users/signup')
  async signup(@requestBody() body: object) {
    return this.userService.signup(body);
  }

  @post('/users/login')
  async login(@requestBody() body: object) {
    return this.userService.login(body);
  }

  @authenticate('jwt')
  @get('/users/me')
  async me(@inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile) {
    console.log(`current user : ${this.currentUser}`);
    return this.userService.getUserById(currentUser[securityId]);
  }

  @authenticate('jwt')
  @get('/users/{id}')
  async findById(@param.path.string('id') id: string) {
    return this.userService.getUserById(id);
  }

  @authenticate('jwt')
  @patch('/users/{id}')
  async updateById(
    @param.path.string('id') id: string,
    @requestBody() body: object,
  ) {
    return this.userService.updateUser(id, body);
  }

  @authenticate('jwt')
  @del('/users/{id}')
  async deleteById(@param.path.string('id') id: string) {
    return this.userService.deleteUser(id);
  }

  @authenticate('jwt')
  @get('/users')
  async find() {
    return this.userService.findAll();
  }

}
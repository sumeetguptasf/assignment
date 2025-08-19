import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import { operation } from '@loopback/rest';

const config = {
  name: 'userService',
  connector: 'rest',
  baseUrl: process.env.USER_SERVICE_URL || 'http://localhost:3002',
  crud: true,
  operations: [
    {
      template: {
        method: 'POST',
        url: '/users/signup',
        body: '{body}',
      },
      functions: {
        signup: ['body'],
      },
    },
    {
      template: {
        method: 'POST',
        url: '/users/login',
        body: '{body}',
      },
      functions: {
        login: ['body'],
      },
    },
    {
      template: {
        method: 'GET',
        url: '/users/{id}',
      },
      functions: {
        getUserById: ['id'],
      },
    },
    {
      template: {
        method: 'PATCH',
        url: '/users/{id}',
        body: '{body}',
      },
      functions: {
        updateUser: ['id', 'body'],
      },
    },
    {
      template: {
        method: 'DELETE',
        url: '/users/{id}',
      },
      functions: {
        deleteUser: ['id'],
      },
    },
    {
      template: {
        method: 'GET',
        url: '/users',
      },
      functions: {
        findAll: [],
      },
    },
  ],
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class UserServiceDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'userService';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.userService', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}

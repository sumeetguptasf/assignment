// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  inject,
  lifeCycleObserver,
  LifeCycleObserver,
  ValueOrPromise,
} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'chatDb',
  connector: 'postgresql',
  url: '',
  host: process.env.CHAT_DB_HOST,
  port: process.env.CHAT_DB_PORT,
  user: process.env.CHAT_DB_USER,
  password: process.env.CHAT_DB_PASSWORD,
  database: process.env.CHAT_DB_DATABASE,
  schema: process.env.CHAT_DB_SCHEMA,
};

@lifeCycleObserver('datasource')
export class PgdbDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static readonly dataSourceName = 'chatDb';

  constructor(
    @inject('datasources.config.chatDb', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }

  /**
   * Start the datasource when application is started
   */
  start(): ValueOrPromise<void> {
    // Add your logic here to be invoked when the application is started
  }

  /**
   * Disconnect the datasource when application is stopped. This allows the
   * application to be shut down gracefully.
   */
  stop(): ValueOrPromise<void> {
    return super.disconnect();
  }
}

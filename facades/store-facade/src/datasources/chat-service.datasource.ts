import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'chatService',
  connector: 'rest',
  baseUrl: process.env.CHAT_SERVICE_URL || 'http://localhost:3005',
  crud: false,
  options: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
  operations: [
    {
      template: {
        method: 'POST',
        url: '{baseUrl}/messages',
        body: '{body}',
      },
      functions: {
        sendMessage: ['body'],
      },
    },
    {
      template: {
        method: 'GET',
        url: '{baseURL}/messages/{id}',
      },
      functions: {
        getMessageById: ['id'],
      },
    },
      
  ],
};

@lifeCycleObserver('datasource')
export class ChatServiceDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = 'chatService';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.chatService', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
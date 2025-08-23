import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'notificationService',
  connector: 'rest',
  baseUrl: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3004',
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
        url: '{baseUrl}/notifications',
        body: '{body}',
      },
      functions: {
        sendNotification: ['body'],
      },
    },
    // {
    //   template: {
    //     method: 'POST',
    //     url: '{baseUrl}/notifications/drafts',
    //     body: '{body}',
    //   },
    //   functions: {
    //     saveDraft: ['body'],
    //   },
    // },
    // {
    //   template: {
    //     method: 'GET',
    //     url: '{baseUrl}/notifications/{id}',
    //   },
    //   functions: {
    //     getNotificationById: ['id'],
    //   },
    // },
  ],
};

@lifeCycleObserver('datasource')
export class NotificationServiceDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = 'notificationService';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.notificationService', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
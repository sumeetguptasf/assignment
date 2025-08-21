import {inject} from '@loopback/core';
import {NotificationServiceDataSource} from '../datasources';

export class NotificationProxyService {
  constructor(
    @inject('datasources.notificationService')
    private notifDS: NotificationServiceDataSource,
  ) {}

  async sendNotification(body: object) {
    return this.notifDS.DataAccessObject.sendNotification(body);
  }

  async saveDraft(body: object) {
    return this.notifDS.DataAccessObject.saveDraft(body);
  }

  async getNotificationById(id: string) {
    return this.notifDS.DataAccessObject.getNotificationById(id);
  }
}
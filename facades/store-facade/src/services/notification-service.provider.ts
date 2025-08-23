import { inject, Provider } from '@loopback/core';
import { NotificationServiceDataSource } from '../datasources';
import { Notification } from '../models';

export interface NotificationService {
    sendNotification(notification: Notification): Promise<Notification>;
}

export class NotificationServiceProvider implements Provider<NotificationService> {
    constructor(
        @inject('datasources.notificationService')
        protected dataSource: NotificationServiceDataSource = new NotificationServiceDataSource(),
    ) { }

    value(): NotificationService {
        return (this.dataSource as any);
    }
}
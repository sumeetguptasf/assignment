import {post, requestBody} from '@loopback/rest';
import {Notification} from '@sourceloop/notification-service';

export class MyNotificationController {
  @post('/notifications')
  async sendNotification(
    @requestBody() notification: Notification,
  ): Promise<object> {
    // Use NotificationService internally
    return {success: true};
  }
}
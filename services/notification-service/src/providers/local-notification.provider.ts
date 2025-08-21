import {Provider} from '@loopback/core';
import {
  Notification,
} from '@sourceloop/notification-service';

export class MyLocalProvider implements Provider<any> {
  value(): any {
    return async (notification: Notification) => {
      console.log('📩 New Email Notification:');
      console.log('----------------------------------');
      console.log('To:', notification.receiver?.to || 'N/A');
      console.log('Subject:', notification.subject || 'No Subject');
      console.log('Body:', notification.body || 'No Body');
      console.log('----------------------------------');
      return Promise.resolve(true); // pretend success
    };
  }
}


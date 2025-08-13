import {Provider} from '@loopback/core';

export class LocalNotificationProvider implements Provider<(notification: any) => Promise<void>> {
  constructor() {}

  value(): (notification: any) => Promise<void> {
    return async (notification: any) => {
      console.log('📢 Local notification:', JSON.stringify(notification, null, 2));
    };
  }
}


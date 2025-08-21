import {post, requestBody, get, param} from '@loopback/rest';
import {inject, service} from '@loopback/core';
import {NotificationProxyService} from '../services/notification-service.proxy';

export class NotificationFacadeController {
  constructor(
    @inject('services.NotificationProxyService')
    private notifService: NotificationProxyService,
  ) {}

  @post('/facade/notifications')
  async sendNotification(@requestBody() body: object) {
    return this.notifService.sendNotification(body);
  }

  @post('/facade/notifications/drafts')
  async saveDraft(@requestBody() body: object) {
    return this.notifService.saveDraft(body);
  }

  @get('/facade/notifications/{id}')
  async getNotification(@param.path.string('id') id: string) {
    return this.notifService.getNotificationById(id);
  }
}
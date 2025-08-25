import {post, requestBody, get, param} from '@loopback/rest';
import {inject, service} from '@loopback/core';
import {NotificationService} from '../services/notification-service.provider';
import { Notification } from '../models'

export class NotificationFacadeController {
  constructor(
    @inject('services.NotificationService')
    private notifService: NotificationService,
  ) {}

  @post('/facade/notifications')
  async sendNotification(@requestBody() body: Notification) {
    return this.notifService.sendNotification(body);
  }

  // @post('/facade/notifications/drafts')
  // async saveDraft(@requestBody() body: object) {
  //   return this.notifService.saveDraft(body);
  // }

  // @get('/facade/notifications/{id}')
  // async getNotification(@param.path.string('id') id: string) {
  //   return this.notifService.getNotificationById(id);
  // }
}
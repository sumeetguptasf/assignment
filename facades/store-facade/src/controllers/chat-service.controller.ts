import {inject} from '@loopback/core';
import {post, get, param, requestBody} from '@loopback/rest';
import {ChatService} from '../services/chat-service.provider';
import {Message} from '../models/chat/message.model';

export class ChatController {
  constructor(
    @inject('services.ChatService')
    private chatService: ChatService,
  ) {}

  @post('facade/chat/messages')
  async sendMessage(@requestBody() message: Message): Promise<Message> {
    console.log('Message at facade: ', message);
    return this.chatService.sendMessage(message);
  }

//   @get('/messages/{id}')
//   async getMessage(@param.path.string('id') id: string): Promise<Message> {
//     return this.chatService.getMessage(id);
//   }
}
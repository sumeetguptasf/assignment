import {inject, Provider} from '@loopback/core';
import {ChatServiceDataSource} from '../datasources';
import {Message} from '../models/chat/message.model';

export interface ChatService {
  sendMessage(message: object): Promise<Message>;
  getMessage(id: string): Promise<Message | null>;
}

export class ChatServiceProvider implements Provider<ChatService> {
  constructor(
    @inject('datasources.chatService')
    protected dataSource: ChatServiceDataSource = new ChatServiceDataSource(),
  ) {}

  value(): ChatService {
    return (this.dataSource as any);
  }
}
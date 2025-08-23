export interface Subscriber {
  id: string;
  name?: string;
  [key: string]: any;
}

export interface Receiver {
  to: Subscriber[];
}

export interface Notification {
  subject: string;
  body: string;
  receiver: Receiver;
  type: number;
  sentDate: string; // ISO date string
  options?: {};
  groupKey?: string;
  isCritical: boolean;
}
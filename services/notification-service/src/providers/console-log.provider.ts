import {Provider} from '@loopback/core';
import {Request, Response} from '@loopback/rest';

export type LogFn = (req: Request, res: Response, err?: Error) => Promise<void>;


export class ConsoleLogProvider implements Provider<any> {
  value(): any {
    return {
      info: (...args: unknown[]) => console.log('ℹ️', ...args),
      error: (...args: unknown[]) => console.error('❌', ...args),
      warn: (...args: unknown[]) => console.warn('⚠️', ...args),
      debug: (...args: unknown[]) => console.debug('🐛', ...args),
    };
  }
}
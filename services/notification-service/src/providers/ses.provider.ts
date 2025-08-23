import {inject, Provider} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {SES} from 'aws-sdk';
import {INotificationConfig, Subscriber} from 'loopback4-notifications';
import { NodemailerBindings } from 'loopback4-notifications/nodemailer';
import {SESBindings, SESMessage, SESNotification} from 'loopback4-notifications/ses';

export class SesProvider implements Provider<SESNotification> {
  sesService: SES;

  constructor(
    @inject(NodemailerBindings.Config, {optional: true})
    private readonly config?: INotificationConfig,

    @inject(SESBindings.Config, {optional: true})
    private readonly sesConfig?: SES.ClientConfiguration,
  ) {
    if (this.sesConfig) {
      this.sesService = new SES(this.sesConfig);
    } else {
      throw new HttpErrors.PreconditionFailed('AWS_SES_CONFIG_MISSING');
    }
  }

  value(): SESNotification {
    return {
      publish: async (message: SESMessage) => {
        if (!message?.receiver?.to || message.receiver.to.length === 0) {
          throw new HttpErrors.BadRequest('MESSAGE_RECEIVER_NOT_FOUND');
        }

        const toAddresses = message.receiver.to.map((s: Subscriber) => s.id);
        console.log('SESProvider: Sending email to:', toAddresses);
        const params: SES.SendEmailRequest = {
          Source:
            message.options?.from ||
            process.env.SES_FROM_EMAIL ||
            'email-smtp.us-east-1.amazonaws.com', // must be verified in SES
            Destination: {
              ToAddresses: toAddresses,
            },
          Message: {
            Subject: {Data: message.subject ?? 'No Subject'},
            Body: {
              Text: {Data: message.body ?? ''},
            },
          },
        };

        await this.sesService.sendEmail(params).promise();
      },
    };
  }
}
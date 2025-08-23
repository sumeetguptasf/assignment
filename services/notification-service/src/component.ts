// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  Binding,
  Component,
  ControllerClass,
  CoreBindings,
  inject,
  ProviderMap,
} from '@loopback/core';
import {Class, Model, Repository} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  BearerVerifierBindings,
  BearerVerifierComponent,
  BearerVerifierConfig,
  BearerVerifierType,
  CoreComponent,
  JwtKeysRepository,
  SECURITY_SCHEME_SPEC,
  ServiceSequence,
} from '@sourceloop/core';
import {JwtKeysRepository as SequelizeJwtKeysRepository} from '@sourceloop/core/sequelize';
import {AuthenticationComponent} from 'loopback4-authentication';
import {
  AuthorizationBindings,
  AuthorizationComponent,
} from 'loopback4-authorization';
import {NotificationBindings, NotificationsComponent} from 'loopback4-notifications';
import {
  NotificationController,
  NotificationNotificationUserController,
  NotificationUserController,
  NotificationUserNotificationController,
  PubnubNotificationController,
  UserNotificationSettingsController,
} from './controllers';
import {NotifServiceBindings} from './keys';
import {Notification, NotificationAccess, NotificationUser} from './models';
import {
  ChannelManagerProvider,
  NotificationFilterProvider,
  NotificationUserSettingsProvider,
} from './providers';
import {NotificationUserProvider} from './providers/notification-user.service';
import {
  NotificationAccessRepository,
  NotificationRepository,
  NotificationUserRepository,
  UserNotificationSettingsRepository,
} from './repositories';

import {
  NotificationRepository as NotificationSequelizeRepository,
  NotificationUserRepository as NotificationUserSequelizeRepository,
  UserNotificationSettingsRepository as UserNotificationSettingsSequelizeRepository,
} from './repositories/sequelize';
import {ProcessNotificationService} from './services';
import {INotifServiceConfig} from './types';
import { MySequence } from './sequence';
import { RestExplorerBindings, RestExplorerComponent } from '@loopback/rest-explorer';
import { SesProvider, SESBindings} from 'loopback4-notifications/ses';
// import { SesProvider } from './providers/ses.provider';
import {
  NodemailerProvider,
  NodemailerBindings,
} from 'loopback4-notifications/nodemailer';

import { MyLocalProvider } from './providers/local-notification.provider';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
export class NotificationServiceComponent implements Component {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private readonly application: RestApplication,
    @inject(NotifServiceBindings.Config, {optional: true})
    private readonly notifConfig?: INotifServiceConfig,
  ) {
    this.bindings = [];
    this.providers = {};

    // Mount core component
    this.application.component(CoreComponent);

    this.application.api({
      openapi: '3.0.0',
      info: {
        title: 'Notification Service',
        version: '1.0.0',
      },
      paths: {},
      components: {
        securitySchemes: SECURITY_SCHEME_SPEC,
      },
      servers: [{url: '/'}],
    });

    // Mount notifications component
    this.application.component(NotificationsComponent);
    this.application.bind(NotificationBindings.NotificationProvider).toProvider(MyLocalProvider);
    this.application.bind(NotifServiceBindings.Config).to({
      useSequelize: false,
    })
    this.application.bind(NotificationBindings.Config).to({
      sendToMultipleReceivers: false,
      senderEmail: 'sumeet.gupta@sourcefuse.com'
    });
    // SES 
    this.application.bind(SESBindings.Config).to({
      accessKeyId: process.env.SES_ACCESS_KEY_ID,
      secretAccessKey: process.env.SES_SECRET_ACCESS_KEY,
      region: process.env.SES_REGION,
    });
    // repositories
    this.application.bind('my-repositories.NotificationRepository').toClass(NotificationRepository);
    this.application.bind(NotificationBindings.NotificationProvider).toProvider(SesProvider);
    // Nodemailer
  
    // this.application.bind(NodemailerBindings.Config).to(<SMTPTransport.Options>{
    //   pool: true,
    //   maxConnections: 100,
    //   url: '',
    //   host: process.env.SMTP_HOST || 'email-smtp.us-east-1.amazonaws.com',
    //   port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
    //   secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    //   auth: {
    //     user: process.env.SMTP_USERNAME || 'default_username',
    //     pass: process.env.SMTP_PASSWORD || 'default_password',
    //   },
    //   tls: {
    //     rejectUnauthorized: false,
    //   },
    // });
    // this.application.bind(NotificationBindings.NotificationProvider).toProvider(
    //   NodemailerProvider,
    // );

    if (!this.notifConfig?.useCustomSequence) {
      // Mount default sequence if needed
      this.setupSequence();
    }
    if (this.notifConfig?.useSequelize || false) {
      this.repositories = [
        NotificationAccessRepository,
        NotificationSequelizeRepository,
        NotificationUserSequelizeRepository,
        UserNotificationSettingsSequelizeRepository,
        SequelizeJwtKeysRepository,
      ];
    } else {
      this.repositories = [
        NotificationAccessRepository,
        NotificationRepository,
        NotificationUserRepository,
        UserNotificationSettingsRepository,
        JwtKeysRepository,
      ];
    }


    this.repositories = [
        NotificationAccessRepository,
        NotificationRepository,
        NotificationUserRepository,
        UserNotificationSettingsRepository,
        JwtKeysRepository,
      ];
    this.models = [Notification, NotificationUser, NotificationAccess];

    this.providers = {
      [NotifServiceBindings.ChannelManager.key]: ChannelManagerProvider,
      [NotifServiceBindings.NotificationUserManager.key]:
        NotificationUserProvider,
      [NotifServiceBindings.NotificationFilter.key]: NotificationFilterProvider,
      [NotifServiceBindings.NotificationSettingFilter.key]:
        NotificationUserSettingsProvider,
    };

    this.controllers = [
      NotificationController,
      NotificationUserController,
      PubnubNotificationController,
      NotificationNotificationUserController,
      NotificationUserNotificationController,
      UserNotificationSettingsController,
    ];

    this.application
      .bind('services.ProcessNotificationService')
      .toClass(ProcessNotificationService);
  }

  providers?: ProviderMap = {};

  bindings?: Binding[] = [];

  /**
   * An optional list of Repository classes to bind for dependency injection
   * via `app.repository()` API.
   */
  repositories?: Class<Repository<Model>>[];

  /**
   * An optional list of Model classes to bind for dependency injection
   * via `app.model()` API.
   */
  models?: Class<Model>[];

  /**
   * An array of controller classes
   */
  controllers?: ControllerClass[];

  /**
   * Setup ServiceSequence by default if no other sequnce provided
   *
   */
  setupSequence() {
    this.application.sequence(MySequence);

// Enable REST Explorer
    this.application.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',   // Swagger UI will be available here
    });
    this.application.component(RestExplorerComponent);
   

    // Mount authentication component for default sequence
    // this.application.component(AuthenticationComponent);
    // Mount bearer verifier component
    // this.application.bind(BearerVerifierBindings.Config).to({
    //   authServiceUrl: '',
    //   type: BearerVerifierType.service,
    // } as BearerVerifierConfig);
    // this.application.component(BearerVerifierComponent);

    // Mount authorization component for default sequence
    // this.application.bind(AuthorizationBindings.CONFIG).to({
    //   allowAlwaysPaths: ['/explorer'],
    // });
    // this.application.component(AuthorizationComponent);
  }
}

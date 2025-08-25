// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import * as path from 'path';
import {ChatServiceComponent} from './component';
import { RestExplorerBindings } from '@loopback/rest-explorer/dist/rest-explorer.keys';
import { RestExplorerComponent } from '@loopback/rest-explorer/dist/rest-explorer.component';
import { MessageRepository } from './repositories';
import { PgdbDataSource } from './datasources';
import dotenv from 'dotenv';
dotenv.config();

export {ApplicationConfig};

export class ChatServiceApplication extends BootMixin(
  RepositoryMixin(RestApplication),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    this.static('/', path.join(__dirname, '../public'));
    this.component(ChatServiceComponent);

    this.projectRoot = __dirname;
    this.bootOptions = {
      controllers: {
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
    this.repository(MessageRepository);
    // this.dataSource(PgdbDataSource);

    this.projectRoot = __dirname;
  }
}

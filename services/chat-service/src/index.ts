// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
export * from './component';
export * from './keys';
export * from './models';
export * from './repositories';
export * from './types';
export * from './enums';

import {ApplicationConfig, ChatServiceApplication} from './application';
import * as dotenv from 'dotenv';
dotenv.config();


const PORT = 3005;

export async function main(options: ApplicationConfig = {}) {
  const app = new ChatServiceApplication(options);
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  return app;
}

if (require.main === module) {
  // Run the application
  const config = {
    rest: {
      port: +(process.env.PORT ?? PORT),
      host: process.env.HOST,
      // The `gracePeriodForClose` provides a graceful close for http/https
      // servers with keep-alive clients. The default value is `Infinity`
      // (don't force-close). If you want to immediately destroy all sockets
      // upon stop, set its value to `0`.
      // See https://www.npmjs.com/package/stoppable
      gracePeriodForClose: 5000, // 5 seconds
      openApiSpec: {
        // useful when used with OpenAPI-to-GraphQL to locate your application
        setServersFromRequest: true,
      },
    },
  };
  main(config).catch(err => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
}

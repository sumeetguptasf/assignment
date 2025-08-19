# authentication

[![LoopBack](https://github.com/loopbackio/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png)](http://loopback.io/)

## Installation

Install AuthenticationComponent using `npm`;

```sh
$ [npm install | yarn add] authentication
```

## Basic Use

Configure and load AuthenticationComponent in the application constructor
as shown below.

```ts
import {AuthenticationComponent, AuthenticationComponentOptions, DEFAULT_AUTHENTICATION_OPTIONS} from 'authentication';
// ...
export class MyApplication extends BootMixin(ServiceMixin(RepositoryMixin(RestApplication))) {
  constructor(options: ApplicationConfig = {}) {
    const opts: AuthenticationComponentOptions = DEFAULT_AUTHENTICATION_OPTIONS;
    this.configure(AuthenticationComponentBindings.COMPONENT).to(opts);
      // Put the configuration options here
    });
    this.component(AuthenticationComponent);
    // ...
  }
  // ...
}
```

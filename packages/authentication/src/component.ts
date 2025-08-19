import {
  Application,
  injectable,
  Component,
  config,
  ContextTags,
  CoreBindings,
  inject,
} from '@loopback/core';
import {AuthenticationComponentBindings} from './keys'
import {DEFAULT_AUTHENTICATION_OPTIONS, AuthenticationComponentOptions} from './types';

// Configure the binding for AuthenticationComponent
@injectable({tags: {[ContextTags.KEY]: AuthenticationComponentBindings.COMPONENT}})
export class AuthenticationComponent implements Component {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private application: Application,
    @config()
    private options: AuthenticationComponentOptions = DEFAULT_AUTHENTICATION_OPTIONS,
  ) {}
}

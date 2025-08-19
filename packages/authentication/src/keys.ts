import {BindingKey, CoreBindings} from '@loopback/core';
import {AuthenticationComponent} from './component';

/**
 * Binding keys used by this component.
 */
export namespace AuthenticationComponentBindings {
  export const COMPONENT = BindingKey.create<AuthenticationComponent>(
    `${CoreBindings.COMPONENTS}.AuthenticationComponent`,
  );
}

import { DefaultEnvVars, UndefinedEnvVars } from './EnvVars';
import { RemoveKeys } from './helpers';

export interface ConfigOptions {
  envPath?: string;
}

export interface Options<Required extends UndefinedEnvVars = DefaultEnvVars, Optional extends UndefinedEnvVars = DefaultEnvVars> {
  required?: Required;
  optional?: RemoveKeys<Optional, keyof Required>;
  options?: ConfigOptions;
}

export interface InternalOptions extends Omit<Required<Options>, 'optional'> {
  optional: DefaultEnvVars;
}

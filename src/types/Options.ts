import { DefaultEnvVars, UndefinedEnvVars } from './EnvVars';
import { RemoveKeys } from './helpers';

export interface EnvOptions {
  envFile?: string;
}

export interface Options<Required extends UndefinedEnvVars = DefaultEnvVars, Optional extends UndefinedEnvVars = DefaultEnvVars> {
  required?: Required;
  optional?: RemoveKeys<Optional, keyof Required>;
  dotEnvOptions?: EnvOptions;
}

export interface InternalOptions extends Omit<Required<Options>, 'optional'> {
  optional: DefaultEnvVars;
}

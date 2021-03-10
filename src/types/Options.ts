import { DefaultEnvVars, UndefinedEnvVars } from './EnvVars';
import { RemoveKeys } from './helpers';

export interface EnvOptions {
  envFile?: string;
  loadDotEnv?: boolean;
}

export interface Options<Required extends UndefinedEnvVars = DefaultEnvVars, Optional extends UndefinedEnvVars = DefaultEnvVars> {
  required?: Required;
  optional?: RemoveKeys<Optional, keyof Required>;
  options?: EnvOptions;
}

export interface InternalOptions extends Omit<Required<Options>, 'optional'> {
  optional: DefaultEnvVars;
}

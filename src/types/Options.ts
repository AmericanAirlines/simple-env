import { DefaultEnvVars, UndefinedEnvVars } from './EnvVars';
import { RemoveKeys } from './helpers';

export interface EnvOptions {
  pathToEnv?: string;
  envFileName?: string;
}

export interface Options<Required extends UndefinedEnvVars = DefaultEnvVars, Optional extends UndefinedEnvVars = DefaultEnvVars> {
  required?: Required;
  optional?: RemoveKeys<Optional, keyof Required>;
  dotEnvOptions?: EnvOptions;
}

export interface InternalOptions extends Required<Options> {
  optional: DefaultEnvVars;
}

import { DotenvConfigOptions } from 'dotenv-flow';
import { DefaultEnvVars, UndefinedEnvVars } from './EnvVars';
import { RemoveKeys } from './helpers';

export interface Options<Required extends UndefinedEnvVars = DefaultEnvVars, Optional extends UndefinedEnvVars = DefaultEnvVars> {
  required?: Required;
  optional?: RemoveKeys<Optional, keyof Required>;
  dotEnvOptions?: DotenvConfigOptions;
}

export interface InternalOptions extends Required<Options> {
  optional: DefaultEnvVars;
}

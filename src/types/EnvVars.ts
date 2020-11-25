import { SymbolWithDescription } from './helpers';

export type UndefinedEnvVars = Record<never, string>;

export type DefaultEnvVars = Record<string, string>;

export type EnvVarSymbols<T extends UndefinedEnvVars> = Record<keyof T, SymbolWithDescription>;

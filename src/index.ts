import { config, DotenvConfigOptions, DotenvLoadOutput } from 'dotenv-flow';
import { EnvVarSymbols, UndefinedEnvVars } from './types/EnvVars';
import { SymbolWithDescription } from './types/helpers';
import { InternalOptions, Options } from './types/Options';

let _requiredEnvVars: SymbolWithDescription[] = [];
let _symbolizedEnvVars: Record<string, SymbolWithDescription>;
let _options: InternalOptions = {
  required: {},
  optional: {},
  dotEnvOptions: {},
};

const createSymbol = (description: string): SymbolWithDescription => Symbol(description) as SymbolWithDescription;

function getEnv(key: SymbolWithDescription): string | undefined {
  const isRequired = _requiredEnvVars.includes(key);
  const value = process.env[key.description];

  if (!value && isRequired) {
    const requiredVarMissingError = `Required environment variable "${key.description}" was not set! Terminating app.`;
    throw new Error(requiredVarMissingError);
  }

  return value;
}

function symbolizeVars<T>(input: Record<string, string>) {
  return Object.entries(input).reduce(
    (acc, [key, item]) => ({
      ...acc,
      [key]: createSymbol(item),
    }),
    {} as T,
  );
}

function parseEnv(options: DotenvConfigOptions = {}): any {
  const { parsed }: DotenvLoadOutput = config(options);
  if (parsed) {
    const required: Record<string, string> = {};
    Object.keys(parsed).forEach((key) => {
      required[key] = key;
    });
    return required;
  }
  return undefined;
}

export default function setEnv<T extends UndefinedEnvVars, V extends UndefinedEnvVars>(
  options: Options<T, V>,
): {
  readonly [K in keyof (T & Partial<V>)]: (T & Partial<V>)[K];
} {
  _options = {
    ..._options,
    ...options,
  };

  parseEnv(_options.dotEnvOptions);

  const symbolizedRequiredEnvVars = symbolizeVars<EnvVarSymbols<T>>(_options.required);
  _requiredEnvVars = Object.values(symbolizedRequiredEnvVars);

  const symbolizedOptionalEnvVars = symbolizeVars<EnvVarSymbols<V>>(_options.optional);

  _symbolizedEnvVars = { ...symbolizedRequiredEnvVars, ...symbolizedOptionalEnvVars };

  return Object.entries(_symbolizedEnvVars).reduce((acc, [key, item]) => {
    Object.defineProperty(acc, key, {
      get: () => getEnv(item),
    });
    return acc;
  }, {} as T & V);
}

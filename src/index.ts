import { readFileSync, existsSync } from 'fs';
import { EOL } from 'os';
import { join } from 'path';
import { EnvVarSymbols, UndefinedEnvVars } from './types/EnvVars';
import { SymbolWithDescription } from './types/helpers';
import { EnvOptions, InternalOptions, Options } from './types/Options';

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

function parseLine(line: string): Record<string, string> {
  const delimiter = '=';
  const lineRegex = /^\s*[a-zA-Z_][a-zA-Z0-9_]*\s*="?'?.*'?"?$/g;
  let [key, val] = line.split(delimiter);

  // Ignore comments, or lines which don't conform to acceptable patterns
  if (key.startsWith('#') || key.startsWith('//') || !lineRegex.test(line)) {
    return {};
  }

  key = key.trim();
  val = val.trim();
  // Get rid of wrapping double or single quotes
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    val = val.substr(1, val.length - 2);
  }

  return { [key]: val };
}

function parseEnvFile(dotEnvOptions: EnvOptions = {}): Record<string, string> {
  const fullPath = dotEnvOptions.envFile || join(process.cwd(), '.env')

  if (!existsSync(fullPath)) {
    return {};
  }

  const envFileContents = readFileSync(fullPath).toString();
  let envVarPairs: Record<string, string> = {};

  const lines = envFileContents.split(EOL);
  lines.forEach((line: string) => {
    envVarPairs = { ...envVarPairs, ...parseLine(line) };
  });

  // Toss everything into the environment
  Object.entries(envVarPairs).forEach(([key, val]) => {
    // Prefer env vars that have been set by the OS
    if (!process.env[key]) {
      process.env[key] = val;
    }
  });

  return envVarPairs;
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

  parseEnvFile(_options.dotEnvOptions);

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

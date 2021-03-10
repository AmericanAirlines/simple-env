import * as fs from 'fs';
import { join } from 'path';
import { ConfigOptions } from './types/Options';

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

export function parseEnvFile(options: ConfigOptions = {}): void {
  const fullPath = options.envFile || join(process.cwd(), '.env');

  if (!fs.existsSync(fullPath)) {
    return;
  }

  const envFileContents = fs.readFileSync(fullPath).toString();
  let envVarPairs: Record<string, string> = {};
  const eol = /\r?\n/;

  const lines = envFileContents.split(eol);
  lines.forEach((line: string) => {
    envVarPairs = { ...envVarPairs, ...parseLine(line) };
  });

  // Toss everything into the environment
  Object.entries(envVarPairs).forEach(([key, val]) => {
    // Prefer env vars that have been set by the OS
    if (key in process.env === false) {
      process.env[key] = val;
    }
  });
}

export default parseEnvFile;

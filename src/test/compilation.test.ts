import 'jest';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import chalk from 'chalk';

jest.setTimeout(10000);

const shouldNotCompile = (filename: string, tsErrors: string[]) => async () => {
  const fixturePath = path.join(process.cwd(), 'src/test/fixtures', filename);
  expect(fs.statSync(fixturePath).isFile()).toBe(true);

  await new Promise<void>((resolve, reject) => {
    exec(`npx tsc --noEmit --strict --lib es2019 ${fixturePath}`, (err, stdout) => {
      expect(err?.code).toBeGreaterThan(0);
      const foundTsErrors = stdout.match(/error TS\d+:/g)?.map((found) => found.replace('error ', '').replace(':', '')) ?? [];

      try {
        expect(foundTsErrors.sort()).toEqual(tsErrors.sort());
        resolve();
      } catch (jestError) {
        const error = new Error(`
${chalk.blueBright('==== Begin Typescript Compiler Output ====================')}

${stdout.trim()}

${chalk.blueBright('==== End Typescript Compiler Output ======================')}

`);

        error.stack = jestError.stack;

        reject(error);
      }
    });
  });
};

describe('compilation errors', () => {
  it('missing key', shouldNotCompile('missingKey.ts', ['TS2339']));
  it('duplicate keys', shouldNotCompile('duplicateKeys.ts', ['TS2322', 'TS2322', 'TS2322', 'TS2322']));
  it('optional key', shouldNotCompile('optionalKey.ts', ['TS2532']));
});

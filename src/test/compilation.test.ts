import 'jest';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

jest.setTimeout(15000);

const shouldNotCompile = (filename: string) => async () => {
  const fixturePath = path.join(process.cwd(), 'src/test/fixtures', filename);
  expect(fs.statSync(fixturePath).isFile()).toBe(true);

  const child = exec(`npx tsc --noEmit --strict --lib es2019 ${fixturePath}`);

  await new Promise<void>((resolve) => {
    child.on('exit', (code) => {
      expect(code).toBeGreaterThan(0);
      resolve();
    });
  });
};

describe('compilation errors', () => {
  it.concurrent('missing key', shouldNotCompile('missingKey.ts'));
  it.concurrent('duplicate keys', shouldNotCompile('duplicateKeys.ts'));
  it.concurrent('optional key', shouldNotCompile('optionalKey.ts'));
});

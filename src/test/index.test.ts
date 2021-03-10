import 'jest';
import fs from 'fs';
import setEnvDefault from '..';
import parseEnvFile from '../parser';

describe('simple-env', () => {
  // Fresh setEnv for each test
  let setEnv: typeof setEnvDefault;
  const readFileSpy = jest.spyOn(fs, 'readFileSync');
  const existsSyncSpy = jest.spyOn(fs, 'existsSync');

  beforeEach(async () => {
    // Reset module cache and dynamically import it again
    jest.resetModules();
    setEnv = (await import('..')).default;
  });

  describe('get', () => {
    const envKey = 'THE_MEANING_OF_LIFE';
    const envShortKey = 'theMeaningOfLife';
    const envValue = '42';

    beforeEach(async () => {
      jest.resetAllMocks();
      process.env[envKey] = envValue;
    });

    afterEach(() => {
      delete process.env[envKey];
    });

    it('will return env vars for known required values', () => {
      const env = setEnv({ required: { [envShortKey]: envKey } });

      expect(env[envShortKey]).toBe(envValue);
    });

    it('will return env vars for known optional values', () => {
      const env = setEnv({ optional: { [envShortKey]: envKey } });

      expect(env[envShortKey]).toBe(envValue);
    });

    it('will return undefined for an unset, optional var', () => {
      const env = setEnv({ optional: { [envShortKey]: envKey } });
      delete process.env[envKey];

      expect(env[envShortKey]).toBe(undefined);
    });

    it('will throw an error for an unset, required var', () => {
      const env = setEnv({ required: { [envShortKey]: envKey } });
      delete process.env[envKey];

      expect(() => env[envShortKey]).toThrow(`Required environment variable "${envKey}" was not set! Terminating app.`);
    });
  });

  describe('set', () => {
    afterEach(() => {
      process.env = {};
      jest.resetModules();
    });

    it('will return env var dictionaries', () => {
      const env = setEnv({
        required: { something: 'SOMETHING' },
        optional: { somethingElse: 'SOMETHING_ELSE' },
      });

      expect(Object.getOwnPropertyDescriptors(env)).toHaveProperty('something');
      expect(Object.getOwnPropertyDescriptors(env)).toHaveProperty('somethingElse');
      expect(Object.getOwnPropertyDescriptor(env, 'something')?.get).toBeDefined();
    });

    it('will use existing env for a subsequent call to set optional vars', () => {
      setEnv({ required: { something: 'SOMETHING' } });
      const env = setEnv({ optional: { somethingElse: 'SOMETHING_ELSE' } });

      expect(Object.getOwnPropertyDescriptors(env)).toHaveProperty('something');
      expect(Object.getOwnPropertyDescriptors(env)).toHaveProperty('somethingElse');
    });

    it('will use existing optionalEnvVars for a subsequent call to set required vars', () => {
      setEnv({ optional: { something: 'SOMETHING' } });
      const env = setEnv({ required: { somethingElse: 'SOMETHING_ELSE' } });

      expect(Object.getOwnPropertyDescriptors(env)).toHaveProperty('something');
      expect(Object.getOwnPropertyDescriptors(env)).toHaveProperty('somethingElse');
    });

    it('will overwrite required vars when set multiple times', () => {
      setEnv({ required: { something: 'SOMETHING' } });
      const env = setEnv({ required: { somethingElse: 'SOMETHING_ELSE' } });

      expect(Object.getOwnPropertyDescriptors(env)).not.toHaveProperty('something');
      expect(Object.getOwnPropertyDescriptors(env)).toHaveProperty('somethingElse');
    });

    it('will overwrite optional vars when set multiple times', () => {
      setEnv({ optional: { something: 'SOMETHING' } });
      const env = setEnv({ optional: { somethingElse: 'SOMETHING_ELSE' } });

      expect(Object.getOwnPropertyDescriptors(env)).not.toHaveProperty('something');
      expect(Object.getOwnPropertyDescriptors(env)).toHaveProperty('somethingElse');
    });

    it('will invoke the parser is loadDotEnv is true', () => {
      existsSyncSpy.mockReturnValue(true);
      readFileSpy.mockImplementation(() => Buffer.from('TEST=test'));

      setEnv({ optional: { something: 'SOMETHING' }, options: { loadDotEnv: true } });

      expect(process.env).toHaveProperty('TEST');
    });

    it('will not invoke the parser by default', () => {
      existsSyncSpy.mockReturnValue(true);
      readFileSpy.mockImplementation(() => Buffer.from('TEST=test'));

      setEnv({ optional: { something: 'SOMETHING' } });

      expect(process.env).not.toHaveProperty('TEST');
    });
  });

  describe('parser', () => {
    beforeEach(() => {
      process.env = {};
    });

    afterEach(() => {
      jest.resetModules();
    });

    it('will not overwrite vars that already exist', () => {
      const originalValue = 'I already exist';
      const newValue = 'I should not';
      process.env = { TEST: originalValue };

      readFileSpy.mockImplementation(() => Buffer.from(`TEST=${newValue}`));
      existsSyncSpy.mockReturnValue(true);

      parseEnvFile();

      expect(process.env.TEST).toEqual(originalValue);
    });

    it('will reject malformed lines', () => {
      const fakeFile =
      `
      bad
      good=this
      4=bad
      good2='this'
      good3="this"
      `;
      readFileSpy.mockImplementation(() => Buffer.from(fakeFile));
      existsSyncSpy.mockReturnValue(true);

      parseEnvFile();

      expect(process.env.good).toEqual('this');
      expect(process.env.good2).toEqual('this');
      expect(process.env.good3).toEqual('this');
    });

    it('will ignore comments in the file', () => {
      const fakeFile =
      `
      #comment\n
      //comment\n
      TEST=test
      `;
      readFileSpy.mockImplementation(() => Buffer.from(fakeFile));
      existsSyncSpy.mockReturnValue(true);

      parseEnvFile();

      expect(process.env.TEST).toEqual('test');
    });

    it('will not do anything if the .env file does not exist', () => {
      readFileSpy.mockImplementation(() => Buffer.from('TEST=test'));
      existsSyncSpy.mockReturnValue(false);

      parseEnvFile();

      expect(process.env.TEST).toBeUndefined();
    });

    it('will read an env variable from a .env file into process.env', () => {
      readFileSpy.mockImplementation(() => Buffer.from('TEST=test'));
      existsSyncSpy.mockReturnValue(true);

      parseEnvFile();

      expect(process.env.TEST).toEqual('test');
    });
  });
});

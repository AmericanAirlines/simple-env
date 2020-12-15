import 'jest';
import setEnvDefault from '..';

describe('simple-env', () => {
  // Fresh setEnv for each test
  let setEnv: typeof setEnvDefault;

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
  });
});

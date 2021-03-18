import fs from 'fs';
import parseEnvFile from '../parser';

describe('parser', () => {
  const readFileSpy = jest.spyOn(fs, 'readFileSync');
  const existsSyncSpy = jest.spyOn(fs, 'existsSync');

  beforeEach(async () => {
    jest.resetModules();
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
    const fakeFile = `
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
    const fakeFile = `
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

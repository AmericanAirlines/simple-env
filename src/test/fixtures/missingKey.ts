import setEnv from '../..';

const env = setEnv({
  required: { secret: '' },
  optional: { optionalSecret: '' },
});

console.log(env.missingKey);

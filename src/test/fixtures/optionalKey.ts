import setEnv from '../..';

const env = setEnv({ optional: { optionalSecret: '' } });

console.log(env.optionalSecret.toString());

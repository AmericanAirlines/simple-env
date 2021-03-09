import setEnv from '../..';

setEnv({
  required: { unique1: '', duplicate: '' },
  optional: { duplicate: '' },
});

setEnv({
  required: { unique1: '', duplicate: '' },
  optional: { unique2: '', duplicate: '' },
});

setEnv({
  required: { duplicate1: '', duplicate2: '' },
  optional: { duplicate1: '', duplicate2: '' },
});

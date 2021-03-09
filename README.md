[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Dependencies: 0](https://img.shields.io/badge/Dependencies-0-brightgreen.svg)](package.json)
![Build and Publish](https://github.com/AmericanAirlines/simple-env/workflows/Build%20and%20Publish/badge.svg)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/AmericanAirlines/simple-env.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/AmericanAirlines/simple-env/alerts/)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/AmericanAirlines/simple-env.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/AmericanAirlines/simple-env/context:javascript)
[![codecov](https://codecov.io/gh/AmericanAirlines/simple-env/branch/main/graph/badge.svg)](https://codecov.io/gh/AmericanAirlines/simple-env)

# `simple-env`

An intuitive, strongly typed, and scalable way to retrieve environment variables.

# Installation

```shell
# Via npm
npm install @americanairlines/simple-env

# Via Yarn
yarn add @americanairlines/simple-env
```

# Usage

Create a file to manage your environment variables (either added via arguments or a `.env` file loaded with [`dotenv`](https://github.com/motdotla/dotenv)):

```typescript
// src/env.ts
import setEnv from '@americanairlines/simple-env';

export const env = setEnv({
  required: {
    nodeEnv: 'NODE_ENV',
    someRequiredSecret: 'SOME_REQUIRED_SECRET',
  },
  optional: {
    anOptionalSecret: 'AN_OPTIONAL_SECRET',
  },
});
```

Import `env` (or whatever you named your export) from your configuration file:

```typescript
// src/index.ts
import env from './env';

const someRequiredSecret = env.someRequiredSecret;
```

### Expected Behavior

| Env Var Type  | State of Variable | Return Value/Behavior                  |
| :-----------: | :---------------: | :------------------------------------- |
|   optional    |        set        | ✅ Associated value returned as string |
|   optional    |       unset       | ✅ `undefined` returned                |
|   required    |        set        | ✅ Associated value returned as string |
|   required    |       unset       | 💥 Runtime error                       |
| N/A - Unknown |        ???        | 💥 Compilation error                   |

> ⚠️ Retrieving an unset and `required` env variable at the root of a file will throw an error and **the app will fail to start**.

# Why use `simple-env`?

Autocomplete and Strongly Typed Keys are your new best friend! Using `simple-env` makes it easier for devs to utilize environment variables via autocomplete and requiring defined keys prevents typos and makes refactoring incredibly simple.

| Feature                            | `simple-env` | `dotenv` | `env-var` |
| :--------------------------------- | :----------: | :------: | :-------: |
| Zero Dependencies                  |      ✅      |    ✅    |    ✅     |
| JS/TS Support                      |      ✅      |    ✅    |    ✅     |
| Required vs Optional Specification |      ✅      |    ❌    |    ✅     |
| Autocomplete                       |      ✅      |    ❌    |    ❌     |
| Strongly Typed Keys                |      ✅      |    ❌    |    ❌     |
| Single Location Refactor           |      ✅      |    ❌    |    ❌     |
| Return Type Helpers                |      🔜      |    ❌    |    ✅     |
| Loads .env                         |      🔜      |    ✅    |    ❌     |

Let's see how some of the features above look in code:

```typescript
// fileA.ts
const secret = process.env.SECRET;
// fileB.ts
const secret = process.env.SECRE;

// 👆 Brittle, susceptible to typos, weak types, and painful to refactor 😓

const env = setEnv({
  required: { secret: 'SOMETHING_SECRET' },
});

const secret = env.secret;
const secret = env.secre; // Property 'secre' does not exist on type '{ readonly secret: string; }'. Did you mean 'secret'? ts(2551)

// 👆 Compilation errors on typos, autocompletes as you type, and env var key can be modified without needing to refactor everywhere 👌

const env = setEnv({
  required: { requiredSecret: 'SOME_REQUIRED_SECRET' },
  optional: { optionalSecret: 'SOME_OPTIONAL_SECRET' },
});

env.requiredSecret.valueOf(); // No error
env.optionalSecret.valueOf(); // Object is possibly 'undefined'. ts(2532)

// 👆 Extremely strong typing - it knows what's required vs optional, which helps you catch bugs faster 🐞
```

# Options

`setEnv` accepts multiple optional arguments:

### Required Env Vars

```typescript
// src/env.ts
import setEnv from '@americanairlines/simple-env';

export const env = setEnv({
  required: {
    nodeEnv: 'NODE_ENV',
    someRequiredSecret: 'SOME_REQUIRED_SECRET',
  },
});
```

### Optional Env Vars

You can choose to only include `optional` env vars by passing in a single object:

```typescript
// src/env.ts
import setEnv from '@americanairlines/simple-env';

export const env = setEnv({
  optional: {
    anOptionalSecret: 'AN_OPTIONAL_SECRET',
  },
});
```

### Individual Assignment

If you want to set your env vars in multiple groups, make sure to destructure the optional env vars properly.

```typescript
// src/env.ts
import setEnv from '@americanairlines/simple-env';

setEnv({
  required: {
    nodeEnv: 'NODE_ENV',
    someRequiredSecret: 'SOME_REQUIRED_SECRET',
  },
});

export const env = setEnv({
  optional: {
    anOptionalSecret: 'AN_OPTIONAL_SECRET',
  },
});
```

> **NOTE**: if you choose to assign `optional` and `required` env vars individually, `setEnv` should only be done _once_ for each or you will overwrite your previously defined values.

# Contributing

Interested in contributing to the project? Check out our [Contributing Guidelines](./.github/CONTRIBUTING.md).

## Running Locally

1. Install dependencies with `npm i`
1. Run `npm run dev` to compile and re-compile on change
1. Run `npm link`
1. Navigate to another Node.js project and run `npm link @americanairlines/simple-env`

You can now use `simple-env` functionality within your project. On changing/adding functionality, the `@americanairlines/simple-env` package will update within your other project so you can test changes immediately.

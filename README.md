# simple-env

An intuitive and scalable way to retrieve environment variables, including the specification of both optional and required variables.

# Installation

```shell
# Via npm
npm install simple-env

# Via Yarn
yarn add simple-env
```

# Usage

Create a file to manage your environment variables (either added via arguments or a `.env` file and [`dotenv`](https://github.com/motdotla/dotenv)):

```typescript
// src/env.ts
import { setEnv } from 'simple-env';

export default const env = setEnv({
  required: {
    nodeEnv: 'NODE_ENV',
    someRequiredSecret: 'SOME_REQUIRED_SECRET',
  },
  optional: {
    anOptionalSecret: 'AN_OPTIONAL_SECRET',
  },
});
```

Import `getEnv` from the package and then retrieve your optional/required variables from your env file:

```typescript
// src/index.ts
import env from './env';

const someRequiredSecret = env.someRequiredSecret;
```

### Expected Behavior

| Env Var Type  | State of Variable | Return Value/Behavior                  |
| :-----------: | :---------------: | :------------------------------------- |
|   optional    |        set        | ✅ Associated value returned as string |
|   optional    |       unset       | ✅ Empty string returned               |
|   required    |        set        | ✅ Associated value returned as string |
|   required    |       unset       | 💥 Error is thrown                     |
| N/A - Unknown |        ???        | 💥 Error is thrown                     |

> ⚠️ Retrieving an unset and `required` env variable at the root of a file will throw an error and **the app will fail to start**.

# Why use Simple Env?

Autocomplete and Defined Keys are your new best friend. Using Simple Env makes it easier for devs to utilize environment variables via autocomplete and requiring defined keys prevents typos and makes refactoring incredibly simple.

|  Package   | Zero Dependencies | JS/TS Support | Loads .env | Required vs Optional Specification | Autocomplete | Requires Defined Keys | Return Type Helpers |
| :--------: | :---------------: | :-----------: | :--------: | :--------------------------------: | :----------: | :-------------------: | :-----------------: |
| Simple Env |        ✅         |      ✅       |     ❌     |                 ✅                 |      ✅      |          ✅           |         🔜          |
|   dotenv   |        ✅         |      ✅       |     ✅     |                 ❌                 |      ❌      |          ❌           |         ❌          |
|  env-var   |        ✅         |      ✅       |     ❌     |                 ✅                 |      ❌      |          ❌           |         ✅          |

```typescript
// fileA.ts
const secret = process.env.SECRET;
// fileB.ts
const secret = process.env.SECRE;

// 👆 Brittle, susceptible to typos, weak types, and painful to refactor 😓

const env = setEnv({
  required: { secret: '' },
});

const secret = env.secret;
const secret = env.secre; // Property 'secre' does not exist on type '{ readonly secret: string; }'. Did you mean 'secret'? ts(2551)

// 👆 Compilation errors on typos, autocompletes as you type, and env var key can be modified without needing to refactor everywhere 👌

const env = setEnv({
  required: { requiredSecret: '' },
  optional: { optionalSecret: '' },
});

env.requiredSecret.valueOf(); // No error
env.optionalSecret.valueOf(); // Object is possibly 'undefined'. ts(2532)

// 👆 Extremely strong typing knows what's required vs optional, catch bugs faster 🐞
```

# Options

`setEnv` accepts multiple optional arguments:

### Required Env Vars

```typescript
// src/env.ts
import { setEnv } from 'simple-env';

export default const env = setEnv({
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
import { setEnv } from 'simple-env';

export default const env = setEnv({
  optional: {
    anOptionalSecret: 'AN_OPTIONAL_SECRET',
  },
});
```

### Individual Assignment

If you want to set your env vars in multiple groups, make sure to destructure the optional env vars properly.

```typescript
// src/env.ts
import { setEnv } from 'simple-env';

setEnv({
  required: {
    nodeEnv: 'NODE_ENV',
    someRequiredSecret: 'SOME_REQUIRED_SECRET',
  },
});

export default const env = setEnv({
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
1. Navigate to another Node.js project and run `npm link simple-env`

You can now use Simple Env functionality within your project. On changing/adding functionality, the `simple-env` package will update within your other project so you can test changes immediately.

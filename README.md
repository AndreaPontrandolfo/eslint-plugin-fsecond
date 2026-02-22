# ESLINT PLUGIN FSECOND

ESLint plugin with some opinionated rules, useful in JavaScript, TypeScript and React projects.

## Requirements

- Node.js >=22
- ESLint >=8.23.0

## Install

```bash
pnpm add -D eslint eslint-plugin-fsecond
```

## Usage

Use a [preset config](#configs) or configure each rule separately.

### With preset

```ts
// eslint.config.ts
import fsecond from "eslint-plugin-fsecond";

export default [fsecond.configs.recommended];
```

### With individual rules

```ts
// eslint.config.ts
import fsecond from "eslint-plugin-fsecond";

export default [
  {
    plugins: { fsecond: fsecond },
    rules: {
      // Override/add rules settings here, such as:
      "fsecond/prefer-destructured-optionals": "error",
    },
  },
];
```

## Configs

<!-- begin auto-generated configs list -->

|     | Name                     |
| :-- | :----------------------- |
| ✅  | `recommended`            |
| ☑️  | `recommendedTypeChecked` |

<!-- end auto-generated configs list -->

## Rules

<!-- begin auto-generated rules list -->

💼 Configurations enabled in.\
✅ Set in the `recommended` configuration.\
☑️ Set in the `recommendedTypeChecked` configuration.\
⚙️ Has configuration options.\
💭 Requires [type information](https://typescript-eslint.io/linting/typed-linting).\
🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).

| Name                                                                         | Description                                                                                                            | 💼    | ⚙️  | 💭  | 🔧  |
| :--------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------- | :---- | :-- | :-- | :-- |
| [no-inline-interfaces](docs/rules/no-inline-interfaces.md)                   | disallow inline object type literals in variable and function annotations; extract to a named interface or type alias. | ✅ ☑️ | ⚙️  |     | 🔧  |
| [no-redundant-jsx-prop-usage](docs/rules/no-redundant-jsx-prop-usage.md)     | disallow passing a JSX prop whose value matches the component's destructuring default for that prop                    | ☑️    |     | 💭  | 🔧  |
| [prefer-destructured-optionals](docs/rules/prefer-destructured-optionals.md) | enforce placing optional parameters on a destructured object instead of the function signature itself                  | ✅ ☑️ |     |     |     |
| [valid-event-listener](docs/rules/valid-event-listener.md)                   | enforces best practices around addEventListener method in React components.                                            | ✅ ☑️ | ⚙️  |     |     |

<!-- end auto-generated rules list -->

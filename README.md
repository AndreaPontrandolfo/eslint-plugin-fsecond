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

|     | Name          |
| :-- | :------------ |
| ✅  | `recommended` |

<!-- end auto-generated configs list -->

## Rules

<!-- begin auto-generated rules list -->

💼 Configurations enabled in.\
✅ Set in the `recommended` configuration.\
🗂️ The type of rule.\
❗ Identifies problems that could cause errors or unexpected behavior.\
📖 Identifies potential improvements.\
⚙️ Has configuration options.

| Name                                                                         | Description                                                                                                            | 💼  | 🗂️  | ⚙️  |
| :--------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------- | :-- | :-- | :-- |
| [no-inline-interfaces](docs/rules/no-inline-interfaces.md)                   | disallow inline object type literals in variable and function annotations; extract to a named interface or type alias. | ✅  | 📖  | ⚙️  |
| [prefer-destructured-optionals](docs/rules/prefer-destructured-optionals.md) | enforce placing optional parameters on a destructured object instead of the function signature itself                  | ✅  | 📖  |     |
| [valid-event-listener](docs/rules/valid-event-listener.md)                   | enforces best practices around addEventListener method in React components.                                            | ✅  | ❗  | ⚙️  |

<!-- end auto-generated rules list -->

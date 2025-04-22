import {
  type SheriffSettings,
  type TSESLint,
  sheriff,
  tseslint,
} from "eslint-config-sheriff";
import eslintPlugin from "eslint-plugin-eslint-plugin";

const sheriffOptions = {
  react: false,
  lodash: false,
  next: false,
  playwright: false,
  jest: false,
  vitest: true,
} satisfies SheriffSettings;

export default tseslint.config([
  {
    ignores: ["vitest.config.ts", "tsdown.config.ts", "eslint.config.ts"],
  },
  ...sheriff(sheriffOptions),
  {
    settings: {
      vitest: {
        typecheck: true,
      },
    },
  },
  {
    rules: {
      "@typescript-eslint/naming-convention": 0,
      "@typescript-eslint/no-unnecessary-condition": 0,
      "@typescript-eslint/no-unsafe-enum-comparison": 0,
      "import/no-default-export": 0,
    },
  },
  eslintPlugin.configs!["flat/recommended"] as TSESLint.FlatConfig.Config,
  {
    files: ["src/rules/*.test.ts"],
    rules: {
      "vitest/expect-expect": [2, { assertFunctionNames: ["ruleTester.run"] }],
    },
  },
]);

import { defineConfig, globalIgnores } from "eslint/config";
import { sheriff, type SheriffSettings } from "eslint-config-sheriff";
import eslintPlugin from "eslint-plugin-eslint-plugin";

const sheriffOptions: SheriffSettings = {
  react: false,
  lodash: false,
  remeda: false,
  next: false,
  astro: false,
  playwright: false,
  storybook: true,
  jest: false,
  vitest: true,
};

export default defineConfig(
  // @ts-expect-error
  sheriff(sheriffOptions),
  eslintPlugin.configs["all-type-checked"],
  {
    rules: {
      "@typescript-eslint/naming-convention": 0,
    },
  },
  globalIgnores([".eslint-doc-generatorrc.js"]),
);

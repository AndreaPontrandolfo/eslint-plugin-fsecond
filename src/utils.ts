import { ESLintUtils } from "@typescript-eslint/utils";
import type { FsecondDocs } from "./types";

export const createEslintRule = ESLintUtils.RuleCreator<FsecondDocs>(
  (ruleName) => ruleName,
);

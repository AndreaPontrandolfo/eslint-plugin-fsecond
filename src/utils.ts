import { ESLintUtils } from "@typescript-eslint/utils";

interface FsecondDocs {
  recommended: boolean;
}

export const createEslintRule = ESLintUtils.RuleCreator<FsecondDocs>(
  (ruleName) => ruleName,
);

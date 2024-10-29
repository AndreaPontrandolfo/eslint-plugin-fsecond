import { describe, test } from "vitest";
import { RuleTester } from "@typescript-eslint/rule-tester";
import rule, { RULE_NAME } from "./prefer-aliased-path";

const valids = [
  `import { myHelper } from "#helpers/myHelper";`,
  `import myHelper from "#helpers/myHelper";`,
  `import { myHelper } from "./helpers/myHelper";`,
  `import { myHook } from "./hooks/myHook";`,
  `import myHook from "./hooks/myHook";`,
  `import { myHook } from "../hooks/myHook";`,
  `import myHook from "../hooks/myHook";`,
  `const myHook = require("../../hooks/myHook");`,
  `const { myHook } = require("../../hooks/myHook");`,
];

const invalids = [[`import { myHelper } from "./src/helpers/myHelper";`]];

describe("prefer-aliased-path", () => {
  test("prefers 'em", () => {
    const ruleTester: RuleTester = new RuleTester();

    ruleTester.run(RULE_NAME, rule, {
      valid: valids,
      invalid: invalids.map((i) => {
        return {
          code: i[0],
          // output: i[1].trim(),
          errors: [{ messageId: "preferAliasedPath" }],
        };
      }),
    });
  });
});

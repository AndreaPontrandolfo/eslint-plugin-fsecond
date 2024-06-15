import { RuleTester } from "@typescript-eslint/utils/ts-eslint";
import { test } from "vitest";
import rule, { RULE_NAME } from "./prefer-aliased-path";

const valids = [
  `import { myHelper } from "#helpers/myHelper";`,
  `import { myHook } from "./hooks/myHook";`,
];

const invalids = [[`import { myHelper } from "./src/helpers/myHelper";`]];

test("prefer-aliased-path", () => {
  const ruleTester: RuleTester = new RuleTester({
    parser: require.resolve("@typescript-eslint/parser"),
  });

  ruleTester.run(RULE_NAME, rule, {
    valid: valids,
    invalid: invalids.map((i) => ({
      code: i[0],
      // output: i[1].trim(),
      errors: [{ messageId: "preferAliasedPath" }],
    })),
  });
});

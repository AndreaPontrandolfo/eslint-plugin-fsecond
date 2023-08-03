import { RuleTester } from "@typescript-eslint/utils/ts-eslint";
import { it } from "vitest";
import rule, { RULE_NAME } from "./prefer-destructured-optionals";

const valids = [
  "function myFunction(param) { console.log(param); }",
  "const myFn = (param) => { console.log(param); }",
  "const myFn = function(param) { console.log(param); }",
  "const myFn = (param1, param2) => { console.log(param1, param2); }",
];

const invalids = [
  [
    "function myFunction(optionalParam?: string) { console.log(optionalParam); }",
    // "function myFunction({ optionalParam } = { optionalParam: '' }) { console.log(optionalParam); }",
  ],
  [
    'const myFn = (optionalParam = "x") => { console.log(optionalParam); }',
    // 'const myFn = ({ optionalParam } = { optionalParam: "x" }) => { console.log(optionalParam); }',
  ],
  [
    "const myFn = function(optionalParam?) { console.log(optionalParam); }",
    // "const myFn = function({ optionalParam }: {optionalParam} = undefined) { console.log(optionalParam); }",
  ],
  [
    "const myFn = (param1, optionalParam?) => { console.log(param1, optionalParam); }",
    // "const myFn = (param1, {optionalParam}: {optionalParam?} = {}) => { console.log(param1, optionalParam); }",
  ],
] as const;

it("prefer-destructured-optionals", () => {
  const ruleTester: RuleTester = new RuleTester({
    parser: require.resolve("@typescript-eslint/parser"),
  });

  ruleTester.run(RULE_NAME, rule, {
    valid: valids,
    invalid: invalids.map((i) => ({
      code: i[0],
      // output: i[1].trim(),
      errors: [{ messageId: "noNonDestructuredOptional" }],
    })),
  });
});

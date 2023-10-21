import { RuleTester } from "@typescript-eslint/utils/ts-eslint";
import { test } from "vitest";
import rule, { RULE_NAME } from "./prefer-destructured-optionals";

const valids = [
  "function myFunction(param) { console.log(param); }",
  "const myFn = (param) => { console.log(param); }",
  "const myFn = function(param) { console.log(param); }",
  "const myFn = (param1, param2) => { console.log(param1, param2); }",
  "function myFunction(param1, param2, {optionalParam}) { console.log(param1, param2, optionalParam); }",
  "const myFn = (param1, param2, {optionalParam = 'x'}) => { console.log(param1, param2, optionalParam); }",
  "const myFn = function(param1, param2, {optionalParam}) { console.log(param1, param2, optionalParam); }",
  "const myFn = (param1, {optionalParam1, optionalParam2}) => { console.log(param1, optionalParam1, optionalParam2); }",
  // Function with required and optional parameters in a destructured object
  "function myFunction({ requiredParam, optionalParam = 'default' }) { console.log(requiredParam, optionalParam); }",
  // Arrow function with required and optional parameters in a destructured object
  "const myFn = ({ requiredParam, optionalParam = 'default' }) => { console.log(requiredParam, optionalParam); }",
  // Function with multiple required parameters followed by an object with optional properties
  "function myFunction(param1, param2, { optionalParam1 = 'default', optionalParam2 = 42 }) { console.log(param1, param2, optionalParam1, optionalParam2); }",
  // Arrow function with required parameters and an object containing optional properties
  "const myFn = (param1, param2, { optionalParam1 = 'default', optionalParam2 = 42 }) => { console.log(param1, param2, optionalParam1, optionalParam2); }",
  // Function with required parameters only
  "function myFunction(param1, param2) { console.log(param1, param2); }",
  // Arrow function with required parameters only
  "const myFn = (param1, param2) => { console.log(param1, param2); }",
  // Function with an object containing optional properties only
  "function myFunction({ optionalParam1 = 'default', optionalParam2 = 42 }) { console.log(optionalParam1, optionalParam2); }",
  // Arrow function with an object containing optional properties only
  "const myFn = ({ optionalParam1 = 'default', optionalParam2 = 42 }) => { console.log(optionalParam1, optionalParam2); }",
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
  [
    "function myFunction(param1, optionalParam?) { console.log(param1, optionalParam); }",
  ],
  [
    'const myFn = (param1, optionalParam = "x") => { console.log(param1, optionalParam); }',
  ],
  [
    "const myFn = function(param1, optionalParam?) { console.log(param1, optionalParam); }",
  ],
  [
    "const myFn = (param1, param2, optionalParam?) => { console.log(param1, param2, optionalParam); }",
  ],
  // Function with optional parameter in the function signature
  [
    "function myFunction(param1, optionalParam = 'default') { console.log(param1, optionalParam); }",
  ],
  // Arrow function with optional parameter in the function signature
  [
    "const myFn = (param1, optionalParam = 'default') => { console.log(param1, optionalParam); }",
  ],
  // Function with required and optional parameters mixed in the function signature
  [
    "function myFunction(param1, { optionalParam1 = 'default' }, param2) { console.log(param1, optionalParam1, param2); }",
  ],
  // Arrow function with required and optional parameters mixed in the function signature
  [
    "const myFn = (param1, { optionalParam1 = 'default' }, param2) => { console.log(param1, optionalParam1, param2); }",
  ],
] as const;

test("prefer-destructured-optionals", () => {
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

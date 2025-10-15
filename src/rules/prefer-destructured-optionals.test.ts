import { run } from "eslint-vitest-rule-tester";
import typescriptParser from "@typescript-eslint/parser";
import rule from "./prefer-destructured-optionals";

await run({
  name: "prefer-destructured-optionals",
  rule,
  languageOptions: {
    parser: typescriptParser,
  },
  valid: [
    // Function with required parameters only
    "function myFunction(param) { console.log(param); }",
    "const myFn = (param) => { console.log(param); }",
    "const myFn = function(param) { console.log(param); }",
    "const myFn = (param1, param2) => { console.log(param1, param2); }",
    "function myFunction(param1, param2) { console.log(param1, param2); }",
    "const myFn = (param1, param2) => { console.log(param1, param2); }",

    // Function with destructured object parameters (valid)
    "function myFunction(param1, param2, {optionalParam}) { console.log(param1, param2, optionalParam); }",
    "const myFn = (param1, param2, {optionalParam = 'x'}) => { console.log(param1, param2, optionalParam); }",
    "const myFn = function(param1, param2, {optionalParam}) { console.log(param1, param2, optionalParam); }",
    "const myFn = (param1, {optionalParam1, optionalParam2}) => { console.log(param1, optionalParam1, optionalParam2); }",

    // Function with required and optional parameters in a destructured object
    "function myFunction({ requiredParam, optionalParam = 'default' }) { console.log(requiredParam, optionalParam); }",
    "const myFn = ({ requiredParam, optionalParam = 'default' }) => { console.log(requiredParam, optionalParam); }",

    // Function with multiple required parameters followed by an object with optional properties
    "function myFunction(param1, param2, { optionalParam1 = 'default', optionalParam2 = 42 }) { console.log(param1, param2, optionalParam1, optionalParam2); }",
    "const myFn = (param1, param2, { optionalParam1 = 'default', optionalParam2 = 42 }) => { console.log(param1, param2, optionalParam1, optionalParam2); }",

    // Function with an object containing optional properties only
    "function myFunction({ optionalParam1 = 'default', optionalParam2 = 42 }) { console.log(optionalParam1, optionalParam2); }",
    "const myFn = ({ optionalParam1 = 'default', optionalParam2 = 42 }) => { console.log(optionalParam1, optionalParam2); }",

    // Complex example with default destructured object
    `const writeJSONToFile = (
      inputFilePath: string,
      outputFilePath: string,
      { discardUnmappedColumns } = {
        discardUnmappedColumns: false,
      },
    ) => {}`,
  ],
  invalid: [
    // Function with optional parameter in signature
    {
      code: "function myFunction(optionalParam?: string) { console.log(optionalParam); }",
      errors: [{ messageId: "noNonDestructuredOptional" }],
    },
    {
      code: 'const myFn = (optionalParam = "x") => { console.log(optionalParam); }',
      errors: [{ messageId: "noNonDestructuredOptional" }],
    },
    {
      code: "const myFn = function(optionalParam?) { console.log(optionalParam); }",
      errors: [{ messageId: "noNonDestructuredOptional" }],
    },

    // Function with mixed required and optional parameters
    {
      code: "const myFn = (param1, optionalParam?) => { console.log(param1, optionalParam); }",
      errors: [{ messageId: "noNonDestructuredOptional" }],
    },
    {
      code: "function myFunction(param1, optionalParam?) { console.log(param1, optionalParam); }",
      errors: [{ messageId: "noNonDestructuredOptional" }],
    },
    {
      code: 'const myFn = (param1, optionalParam = "x") => { console.log(param1, optionalParam); }',
      errors: [{ messageId: "noNonDestructuredOptional" }],
    },
    {
      code: "const myFn = function(param1, optionalParam?) { console.log(param1, optionalParam); }",
      errors: [{ messageId: "noNonDestructuredOptional" }],
    },
    {
      code: "const myFn = (param1, param2, optionalParam?) => { console.log(param1, param2, optionalParam); }",
      errors: [{ messageId: "noNonDestructuredOptional" }],
    },

    // Function with optional parameter with default value
    {
      code: "function myFunction(param1, optionalParam = 'default') { console.log(param1, optionalParam); }",
      errors: [{ messageId: "noNonDestructuredOptional" }],
    },
    {
      code: "const myFn = (param1, optionalParam = 'default') => { console.log(param1, optionalParam); }",
      errors: [{ messageId: "noNonDestructuredOptional" }],
    },

    // Function with destructured object in the middle (invalid pattern)
    {
      code: "function myFunction(param1, { optionalParam1 = 'default' }, param2) { console.log(param1, optionalParam1, param2); }",
      errors: [{ messageId: "noNonDestructuredOptional" }],
    },
    {
      code: "const myFn = (param1, { optionalParam1 = 'default' }, param2) => { console.log(param1, optionalParam1, param2); }",
      errors: [{ messageId: "noNonDestructuredOptional" }],
    },
  ],
});

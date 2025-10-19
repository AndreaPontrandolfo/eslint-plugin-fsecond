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

    // Rest parameters (valid)
    "function myFunction(...rest) { console.log(rest); }",
    "const myFn = (...rest) => { console.log(rest); }",
    "function myFunction(param1, ...rest) { console.log(param1, rest); }",
    "const myFn = (param1, ...rest) => { console.log(param1, rest); }",

    // Destructured object with rest properties
    "function myFunction({ requiredParam, ...rest }) { console.log(requiredParam, rest); }",
    "const myFn = ({ requiredParam, ...rest }) => { console.log(requiredParam, rest); }",

    // Nested destructuring (valid)
    "function myFunction({ nested: { optionalParam = 'default' } }) { console.log(optionalParam); }",
    "const myFn = ({ nested: { optionalParam = 'default' } }) => { console.log(optionalParam); }",

    // Array destructuring (valid)
    "function myFunction([first, second]) { console.log(first, second); }",
    "const myFn = ([first, second]) => { console.log(first, second); }",

    // Mixed destructuring patterns (valid - object pattern at the end)
    "function myFunction(param1, [first, second], { optionalParam = 'default' }) { console.log(param1, first, second, optionalParam); }",
    "const myFn = (param1, [first, second], { optionalParam = 'default' }) => { console.log(param1, first, second, optionalParam); }",

    // TypeScript type annotations (valid)
    "function myFunction(param1: string, { optionalParam = 'default' }: { optionalParam?: string }) { console.log(param1, optionalParam); }",
    "const myFn = (param1: string, { optionalParam = 'default' }: { optionalParam?: string }) => { console.log(param1, optionalParam); }",

    // Class methods (valid)
    "class MyClass { myMethod(param1: string, { optionalParam = 'default' }: { optionalParam?: string }) { console.log(param1, optionalParam); } }",
    "const obj = { myMethod(param1: string, { optionalParam = 'default' }: { optionalParam?: string }) { console.log(param1, optionalParam); } }",

    // Function with only destructured object parameter
    "function myFunction({ param1, param2 }) { console.log(param1, param2); }",
    "const myFn = ({ param1, param2 }) => { console.log(param1, param2); }",

    // Destructured object with computed properties
    "function myFunction({ [Symbol.iterator]: iterator }) { console.log(iterator); }",
    "const myFn = ({ [Symbol.iterator]: iterator }) => { console.log(iterator); }",

    // Destructured object with default values for all properties
    "function myFunction({ param1 = 'default1', param2 = 'default2' } = {}) { console.log(param1, param2); }",
    "const myFn = ({ param1 = 'default1', param2 = 'default2' } = {}) => { console.log(param1, param2); }",
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

    // Multiple optional parameters
    {
      code: "function myFunction(optionalParam1?, optionalParam2?) { console.log(optionalParam1, optionalParam2); }",
      errors: [
        { messageId: "noNonDestructuredOptional" },
        { messageId: "noNonDestructuredOptional" },
      ],
    },
    {
      code: "const myFn = (optionalParam1?, optionalParam2?) => { console.log(optionalParam1, optionalParam2); }",
      errors: [
        { messageId: "noNonDestructuredOptional" },
        { messageId: "noNonDestructuredOptional" },
      ],
    },

    // Mixed optional parameters with defaults
    {
      code: "function myFunction(optionalParam1?, optionalParam2 = 'default') { console.log(optionalParam1, optionalParam2); }",
      errors: [
        { messageId: "noNonDestructuredOptional" },
        { messageId: "noNonDestructuredOptional" },
      ],
    },
    {
      code: "const myFn = (optionalParam1?, optionalParam2 = 'default') => { console.log(optionalParam1, optionalParam2); }",
      errors: [
        { messageId: "noNonDestructuredOptional" },
        { messageId: "noNonDestructuredOptional" },
      ],
    },

    // Optional parameters with TypeScript annotations
    {
      code: "function myFunction(optionalParam?: string) { console.log(optionalParam); }",
      errors: [{ messageId: "noNonDestructuredOptional" }],
    },
    {
      code: "const myFn = (optionalParam?: string) => { console.log(optionalParam); }",
      errors: [{ messageId: "noNonDestructuredOptional" }],
    },

    // Optional parameters with complex default values
    {
      code: "function myFunction(optionalParam = { nested: { value: 'default' } }) { console.log(optionalParam); }",
      errors: [{ messageId: "noNonDestructuredOptional" }],
    },
    {
      code: "const myFn = (optionalParam = { nested: { value: 'default' } }) => { console.log(optionalParam); }",
      errors: [{ messageId: "noNonDestructuredOptional" }],
    },

    // Optional parameters with function defaults
    {
      code: "function myFunction(optionalParam = () => 'default') { console.log(optionalParam); }",
      errors: [{ messageId: "noNonDestructuredOptional" }],
    },
    {
      code: "const myFn = (optionalParam = () => 'default') => { console.log(optionalParam); }",
      errors: [{ messageId: "noNonDestructuredOptional" }],
    },

    // Optional parameters with array defaults
    {
      code: "function myFunction(optionalParam = [1, 2, 3]) { console.log(optionalParam); }",
      errors: [{ messageId: "noNonDestructuredOptional" }],
    },
    {
      code: "const myFn = (optionalParam = [1, 2, 3]) => { console.log(optionalParam); }",
      errors: [{ messageId: "noNonDestructuredOptional" }],
    },

    // Class methods with optional parameters
    {
      code: "class MyClass { myMethod(optionalParam?: string) { console.log(optionalParam); } }",
      errors: [{ messageId: "noNonDestructuredOptional" }],
    },
    {
      code: "const obj = { myMethod(optionalParam?: string) { console.log(optionalParam); } }",
      errors: [{ messageId: "noNonDestructuredOptional" }],
    },

    // Mixed required and optional parameters with rest parameters
    {
      code: "function myFunction(param1, optionalParam?, ...rest) { console.log(param1, optionalParam, rest); }",
      errors: [{ messageId: "noNonDestructuredOptional" }],
    },
    {
      code: "const myFn = (param1, optionalParam?, ...rest) => { console.log(param1, optionalParam, rest); }",
      errors: [{ messageId: "noNonDestructuredOptional" }],
    },

    // Optional parameters with destructured object in the middle
    {
      code: "function myFunction(optionalParam?, { requiredParam }, param2) { console.log(optionalParam, requiredParam, param2); }",
      errors: [
        { messageId: "noNonDestructuredOptional" },
        { messageId: "noNonDestructuredOptional" },
      ],
    },
    {
      code: "const myFn = (optionalParam?, { requiredParam }, param2) => { console.log(optionalParam, requiredParam, param2); }",
      errors: [
        { messageId: "noNonDestructuredOptional" },
        { messageId: "noNonDestructuredOptional" },
      ],
    },

    // Complex nested optional parameters
    {
      code: "function myFunction(optionalParam1?, optionalParam2 = 'default', optionalParam3?) { console.log(optionalParam1, optionalParam2, optionalParam3); }",
      errors: [
        { messageId: "noNonDestructuredOptional" },
        { messageId: "noNonDestructuredOptional" },
        { messageId: "noNonDestructuredOptional" },
      ],
    },
    {
      code: "const myFn = (optionalParam1?, optionalParam2 = 'default', optionalParam3?) => { console.log(optionalParam1, optionalParam2, optionalParam3); }",
      errors: [
        { messageId: "noNonDestructuredOptional" },
        { messageId: "noNonDestructuredOptional" },
        { messageId: "noNonDestructuredOptional" },
      ],
    },

    // Optional parameters with array destructuring in the middle
    {
      code: "function myFunction(param1, [first, second], optionalParam?) { console.log(param1, first, second, optionalParam); }",
      errors: [{ messageId: "noNonDestructuredOptional" }],
    },
    {
      code: "const myFn = (param1, [first, second], optionalParam?) => { console.log(param1, first, second, optionalParam); }",
      errors: [{ messageId: "noNonDestructuredOptional" }],
    },

    // Array destructuring after object pattern (invalid pattern)
    {
      code: "function myFunction(param1, { optionalParam = 'default' }, [first, second]) { console.log(param1, optionalParam, first, second); }",
      errors: [{ messageId: "noNonDestructuredOptional" }],
    },
    {
      code: "const myFn = (param1, { optionalParam = 'default' }, [first, second]) => { console.log(param1, optionalParam, first, second); }",
      errors: [{ messageId: "noNonDestructuredOptional" }],
    },

    // AssignmentPattern with ObjectPattern on left side - function f(a, { x } = {}, b) -> error on b
    {
      code: "function f(a, { x } = {}, b) { console.log(a, x, b); }",
      errors: [{ messageId: "noNonDestructuredOptional" }],
    },
    {
      code: "const f = (a, { x } = {}, b) => { console.log(a, x, b); }",
      errors: [{ messageId: "noNonDestructuredOptional" }],
    },

    // AssignmentPattern with ObjectPattern on left side - const g = ({ x } = {}, { y } = {}) => {} -> error on second param
    {
      code: "const g = ({ x } = {}, { y } = {}) => { console.log(x, y); }",
      errors: [{ messageId: "noNonDestructuredOptional" }],
    },
  ],
});

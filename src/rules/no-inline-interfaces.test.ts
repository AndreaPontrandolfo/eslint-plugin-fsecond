import { run } from "eslint-vitest-rule-tester";
import typescriptParser from "@typescript-eslint/parser";
import rule from "./no-inline-interfaces";

run({
  name: "no-inline-interfaces",
  rule,
  languageOptions: {
    parser: typescriptParser,
  },

  valid: [
    // Interface usage - variables
    `interface MyInterface { prop1: string; prop2: number }
const myVariable: MyInterface = {};`,

    // Interface usage - variables - different formatting
    `interface MyInterface {
      prop1: string
      prop2: number
    }
const myVariable: MyInterface = {};`,

    // Type alias usage - variables - simple primitive
    `type MyType = string
const myVariable: MyType = '';`,

    // Type alias usage - variables - object literal
    `type MyType = { prop1: string; prop2: number }
const myVariable: MyType = {};`,

    // Interface usage - arrow function with destructured params
    `interface MyInterface { prop1: string; prop2: number }
export const MyReactComponent = ({prop1, prop2}: MyInterface) => {}`,

    // Interface usage - arrow function with props param
    `interface MyInterface { prop1: string; prop2: number }
export const MyReactComponent = (props: MyInterface) => {}`,

    // Interface usage - function declaration with destructured params
    `interface MyInterface { prop1: string; prop2: number }
function MyReactComponent({prop1, prop2}: MyInterface) {}`,

    // Interface usage - function declaration with props param
    `interface MyInterface { prop1: string; prop2: number }
function MyReactComponent(props: MyInterface) {}`,

    // Function declaration - simple primitive
    `function MyReactComponent(param: string) {}`,

    // Function declaration - simple type alias primitive
    `type MyString = string
    function MyReactComponent(param: MyString) {}`,

    // Type alias usage - function return type
    `type ReturnType = { a: string; b: number }
function f(): ReturnType { return { a: '', b: 0 } }`,

    // Non-object types
    `const x: string = '';`,
    `const y: number = 0;`,
    `const z: boolean = true;`,

    // Union with named types
    `interface Props { a: string }
const x: Props | null = null;`,

    // Intersection with named types
    `interface A { a: string }
interface B { b: number }
const x: A & B = {};`,

    // Generic type arguments (should be ignored)
    `const x: Readonly<{ a: string }> = {};`,
    `const y: Promise<{ a: string }> = Promise.resolve({ a: '' });`,
    `const z: Array<{ a: string }> = [];`,

    // Type declarations themselves (should not be flagged)
    `type MyType = { a: string; b: number };`,
    `interface MyInterface { a: string; b: number }`,

    // Mapped types with generic arguments (should be ignored)
    `const x: Record<string, { a: string }> = {};`,
    `const y: Partial<{ a: string }> = {};`,
    `const z: Pick<{ a: string; b: number }, 'a'> = {};`,

    // Async function with Promise wrapper (valid because Promise is generic)
    `async function fetchData(): Promise<{ data: string }> { return { data: '' }; }`,

    // Class with typed properties using named types
    `interface UserData { name: string; age: number }
class User {
  data: UserData;
}`,

    // Optional parameter with named type
    `interface Config { debug: boolean }
function setup(config?: Config) {}`,

    // Rest parameter with named type array
    `interface Item { id: string }
function process(...items: Item[]) {}`,

    // Classes are ignored - inline types in classes are allowed
    `class User {
  data: { name: string; age: number };
}`,

    `class Service {
  process(data: { id: string; value: number }) {}
}`,

    `class Service {
  getData(): { id: string; value: number } {
    return { id: '', value: 0 };
  }
}`,
  ],

  invalid: [
    // Variable with inline object type
    {
      code: `const myVariable: { prop1: string; prop2: number } = {};`,
      errors: ["noInlineInterfaces"],
    },

    // Arrow function with inline object type on destructured params
    {
      code: `export const MyReactComponent = ({prop1, prop2}: {prop1: string, prop2: number}) => {}`,
      errors: ["noInlineInterfaces"],
    },

    // Arrow function with inline object type on props param
    {
      code: `export const MyReactComponent = (props: {prop1: string, prop2: number}) => {}`,
      errors: ["noInlineInterfaces"],
    },

    // Function declaration with inline object type on destructured params
    {
      code: `function MyReactComponent({prop1, prop2}: {prop1: string, prop2: number}) {}`,
      errors: ["noInlineInterfaces"],
    },

    // Function declaration with inline object type on props param
    {
      code: `function MyReactComponent(props: {prop1: string, prop2: number}) {}`,
      errors: ["noInlineInterfaces"],
    },

    // Function expression with inline object type
    {
      code: `const fn = function(props: {a: string}) {}`,
      errors: ["noInlineInterfaces"],
    },

    // Function with inline return type
    {
      code: `function f(): { a: string } { return { a: '' }  }`,
      errors: ["noInlineInterfaces"],
    },

    // Arrow function with inline return type
    {
      code: `const f = (): { a: string } => ({ a: '' })`,
      errors: ["noInlineInterfaces"],
    },

    // Union with inline object type (should flag only the object literal)
    {
      code: `const x: { a: string } | null = null;`,
      errors: ["noInlineInterfaces"],
    },

    // Intersection with inline object type (should flag only the object literal)
    {
      code: `const x: { a: string } & { b: number } = {};`,
      errors: ["noInlineInterfaces", "noInlineInterfaces"],
    },

    // Union with named type and inline object
    {
      code: `interface B { b: number }
const x: B | { a: string } = {};`,
      errors: ["noInlineInterfaces"],
    },

    // Intersection with named type and inline object
    {
      code: `interface B { b: number }
const x: B & { a: string } = {};`,
      errors: ["noInlineInterfaces"],
    },

    // Multiple function params with inline types
    {
      code: `function fn(a: { x: string }, b: { y: number }) {}`,
      errors: ["noInlineInterfaces", "noInlineInterfaces"],
    },

    // Array syntax (not generic)
    {
      code: `const x: { a: string }[] = [];`,
      errors: ["noInlineInterfaces"],
    },

    // Tuple type
    {
      code: `const x: [{ a: string }, number] = [{a: ''}, 0];`,
      errors: ["noInlineInterfaces"],
    },

    // Optional parameter with inline object type
    {
      code: `function setup(config?: { debug: boolean }) {}`,
      errors: ["noInlineInterfaces"],
    },

    // Rest parameter with inline object type array
    {
      code: `function process(...items: { id: string }[]) {}`,
      errors: ["noInlineInterfaces"],
    },

    // Nested destructuring with inline type
    {
      code: `function fn({ user }: { user: { name: string } }) {}`,
      errors: ["noInlineInterfaces", "noInlineInterfaces"],
    },

    // Complex union with multiple inline objects
    {
      code: `const x: { type: 'a'; value: string } | { type: 'b'; value: number } = { type: 'a', value: '' };`,
      errors: ["noInlineInterfaces", "noInlineInterfaces"],
    },

    // Inline object with method signature
    {
      code: `const handler: { onClick(): void; onHover(): void } = { onClick() {}, onHover() {} };`,
      errors: ["noInlineInterfaces"],
    },

    // Inline object with index signature
    {
      code: `const map: { [key: string]: number } = {};`,
      errors: ["noInlineInterfaces"],
    },

    // Type assertion doesn't exempt from rule
    {
      code: `const data: { id: string } = { id: '123' } as { id: string };`,
      errors: ["noInlineInterfaces"],
    },
  ],
});

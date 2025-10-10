import { RuleTester } from "@typescript-eslint/utils/ts-eslint";
import { test } from "vitest";
import rule, { RULE_NAME } from "./no-inline-interfaces";

const valids = [
  // Interface usage - variables
  `interface MyInterface { prop1: string; prop2: number }
const myVariable: MyInterface = {} as any;`,

  // Type alias usage - variables
  `type MyType = { prop1: string; prop2: number }
const myVariable: MyType = {} as any;`,

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
const x: A & B = {} as any;`,

  // Generic type arguments (should be ignored)
  `const x: Readonly<{ a: string }> = {} as any;`,
  `const y: Promise<{ a: string }> = Promise.resolve({ a: '' });`,
  `const z: Array<{ a: string }> = [];`,

  // Type declarations themselves (should not be flagged)
  `type MyType = { a: string; b: number };`,
  `interface MyInterface { a: string; b: number }`,
];

const invalids = [
  // Variable with inline object type
  [`const myVariable: { prop1: string; prop2: number } = {} as any;`],

  // Arrow function with inline object type on destructured params
  [
    `export const MyReactComponent = ({prop1, prop2}: {prop1: string, prop2: number}) => {}`,
  ],

  // Arrow function with inline object type on props param
  [
    `export const MyReactComponent = (props: {prop1: string, prop2: number}) => {}`,
  ],

  // Function declaration with inline object type on destructured params
  [
    `function MyReactComponent({prop1, prop2}: {prop1: string, prop2: number}) {}`,
  ],

  // Function declaration with inline object type on props param
  [`function MyReactComponent(props: {prop1: string, prop2: number}) {}`],

  // Function expression with inline object type
  [`const fn = function(props: {a: string}) {}`],

  // Function with inline return type
  [`function f(): { a: string } { return { a: '' } as any }`],

  // Arrow function with inline return type
  [`const f = (): { a: string } => ({ a: '' })`],

  // Union with inline object type (should flag only the object literal)
  [`const x: { a: string } | null = null;`],

  // Intersection with inline object type (should flag only the object literal)
  [`const x: { a: string } & { b: number } = {} as any;`, 2], // 2 errors

  // Union with named type and inline object
  [
    `interface B { b: number }
const x: B | { a: string } = {} as any;`,
  ],

  // Intersection with named type and inline object
  [
    `interface B { b: number }
const x: B & { a: string } = {} as any;`,
  ],

  // Multiple function params with inline types
  [`function fn(a: { x: string }, b: { y: number }) {}`, 2], // 2 errors

  // Array syntax (not generic)
  [`const x: { a: string }[] = [];`],

  // Tuple type
  [`const x: [{ a: string }, number] = [{a: ''}, 0];`],
];

test("no-inline-interfaces", () => {
  const ruleTester: RuleTester = new RuleTester({
    parser: require.resolve("@typescript-eslint/parser"),
  });

  ruleTester.run(RULE_NAME, rule, {
    valid: valids,
    invalid: invalids.map((i) => ({
      code: i[0] as string,
      errors: Array(typeof i[1] === "number" ? i[1] : 1).fill({
        messageId: "noInlineInterfaces",
      }),
    })),
  });
});

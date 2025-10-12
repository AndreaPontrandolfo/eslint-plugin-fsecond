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

    // Return types are NOT checked by default
    `function f(): { a: string } { return { a: '' }  }`,
    `const f = (): { a: string } => ({ a: '' })`,
    `async function fetchData(): Promise<{ data: string }> { return { data: '' }; }`,

    // Type parameters/generics with named types
    `interface Item { id: string }
function getItems<T extends Item>(): T[] { return []; }`,

    // Generic constraints
    `interface Base { id: string }
function process<T extends Base>(item: T): void {}`,

    // Conditional types (shouldn't be flagged)
    `type IsString<T> = T extends string ? { value: T } : never;
const x: IsString<string> = { value: '' };`,

    // Utility types with named types
    `interface User { name: string; age: number }
const partial: Partial<User> = {};
const required: Required<Partial<User>> = { name: '', age: 0 };
const picked: Pick<User, 'name'> = { name: '' };
const omitted: Omit<User, 'age'> = { name: '' };`,

    // Function types (not object types)
    `const fn: (x: number) => number = (x) => x;`,
    `const callback: () => void = () => {};`,

    // Array of named types
    `interface Item { id: string }
const items: Item[] = [];`,

    // Object with named type properties
    `interface Address { street: string }
interface Person { name: string; address: Address }
const person: Person = { name: '', address: { street: '' } };`,

    // Nested named types
    `interface Inner { value: string }
interface Outer { inner: Inner }
const data: Outer = { inner: { value: '' } };`,

    // Tuple with named types
    `interface A { a: string }
interface B { b: number }
const tuple: [A, B] = [{ a: '' }, { b: 0 }];`,

    // Union of named types
    `interface Cat { meow: string }
interface Dog { bark: string }
const pet: Cat | Dog = { meow: '' };`,

    // Intersection of named types only (all named, no inline objects)
    `interface Named { name: string }
interface WithId { id: number }
const value: Named & WithId = { name: '', id: 0 };`,

    // Generic functions with inline constraints (constraints are not annotations)
    `function compare<T extends { value: number }>(a: T, b: T): boolean { return a.value > b.value; }`,

    // Typeof with inline object (typeof is not a type annotation we check)
    `const config = { debug: true };
const copy: typeof config = { debug: false };`,

    // Indexed access types
    `interface User { settings: { theme: string } }
const theme: User['settings'] = { theme: 'dark' };`,

    // Mapped types
    `type Keys = 'a' | 'b';
type Mapped = { [K in Keys]: string };
const obj: Mapped = { a: '', b: '' };`,

    // Template literal types
    `type EventName = \`on\${'Click' | 'Hover'}\`;
const handler: Record<EventName, () => void> = { onClick: () => {}, onHover: () => {} };`,

    // Const assertions (not type annotations)
    `const obj = { x: 1, y: 2 } as const;`,

    // Type predicates
    `function isString(x: unknown): x is string { return typeof x === 'string'; }`,

    // Enum types
    `enum Status { Active, Inactive }
const status: Status = Status.Active;`,

    // Namespace types
    `namespace App { export interface Config { debug: boolean } }
const config: App.Config = { debug: true };`,
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

    // Destructuring with default values
    {
      code: `function fn({ x = 0 }: { x?: number } = {}) {}`,
      errors: ["noInlineInterfaces"],
    },

    // Multiple destructured parameters
    {
      code: `function fn({ a }: { a: string }, { b }: { b: number }) {}`,
      errors: ["noInlineInterfaces", "noInlineInterfaces"],
    },

    // Optional property in inline type
    {
      code: `const x: { a?: string } = {};`,
      errors: ["noInlineInterfaces"],
    },

    // Readonly property in inline type
    {
      code: `const x: { readonly a: string } = { a: '' };`,
      errors: ["noInlineInterfaces"],
    },

    // Computed property in inline type
    {
      code: `const key = 'id'; const x: { [key]: string } = { id: '' };`,
      errors: ["noInlineInterfaces"],
    },

    // Call signature in inline type
    {
      code: `const fn: { (): void } = () => {};`,
      errors: ["noInlineInterfaces"],
    },

    // Construct signature in inline type
    {
      code: `const Ctor: { new (): object } = class {};`,
      errors: ["noInlineInterfaces"],
    },

    // Mixed union with primitives and inline objects
    {
      code: `const x: string | { error: true } = { error: true };`,
      errors: ["noInlineInterfaces"],
    },

    // Nested unions with inline objects
    {
      code: `const x: ({ a: string } | { b: number }) | null = null;`,
      errors: ["noInlineInterfaces", "noInlineInterfaces"],
    },

    // Let and var declarations
    {
      code: `let mutable: { count: number } = { count: 0 };`,
      errors: ["noInlineInterfaces"],
    },
    {
      code: `var legacy: { value: string } = { value: '' };`,
      errors: ["noInlineInterfaces"],
    },

    // Async function with inline param type
    {
      code: `async function fetchData(config: { url: string }) { return ''; }`,
      errors: ["noInlineInterfaces"],
    },

    // Generator function with inline type
    {
      code: `function* gen(opts: { max: number }) { yield 1; }`,
      errors: ["noInlineInterfaces"],
    },

    // Arrow function in object property
    {
      code: `const obj = { method: (param: { x: number }) => param.x };`,
      errors: ["noInlineInterfaces"],
    },

    // Arrow function in array
    {
      code: `const fns = [(x: { a: string }) => x.a];`,
      errors: ["noInlineInterfaces"],
    },

    // IIFE with inline type
    {
      code: `((config: { debug: boolean }) => {})(true);`,
      errors: ["noInlineInterfaces"],
    },

    // Callback with inline type
    {
      code: `[].map((item: { id: string }) => item.id);`,
      errors: ["noInlineInterfaces"],
    },

    // Default parameter with inline type
    {
      code: `function fn(opts: { x: number } = { x: 0 }) {}`,
      errors: ["noInlineInterfaces"],
    },
  ],
});

// Test with checkReturnTypes: true
run({
  name: "no-inline-interfaces (checkReturnTypes: true)",
  rule,
  languageOptions: {
    parser: typescriptParser,
  },

  valid: [
    // Return types with named types are valid
    {
      code: `type ReturnType = { a: string; b: number }
function f(): ReturnType { return { a: '', b: 0 } }`,
      options: [{ checkReturnTypes: true }],
    },

    {
      code: `interface Data { id: string }
const getData = (): Data => ({ id: '' })`,
      options: [{ checkReturnTypes: true }],
    },

    // Promise with named type is valid
    {
      code: `interface Result { success: boolean }
async function process(): Promise<Result> { return { success: true }; }`,
      options: [{ checkReturnTypes: true }],
    },

    // Void and primitive returns are valid
    {
      code: `function noReturn(): void {}`,
      options: [{ checkReturnTypes: true }],
    },
    {
      code: `const getString = (): string => '';`,
      options: [{ checkReturnTypes: true }],
    },
  ],

  invalid: [
    // Function with inline return type
    {
      code: `function f(): { a: string } { return { a: '' } }`,
      options: [{ checkReturnTypes: true }],
      errors: ["noInlineInterfaces"],
    },

    // Arrow function with inline return type
    {
      code: `const f = (): { a: string } => ({ a: '' })`,
      options: [{ checkReturnTypes: true }],
      errors: ["noInlineInterfaces"],
    },

    // Function expression with inline return type
    {
      code: `const f = function(): { a: string } { return { a: '' } }`,
      options: [{ checkReturnTypes: true }],
      errors: ["noInlineInterfaces"],
    },

    // Async function with inline return type (needs both options)
    // Note: Promise<{ data: string }> requires checkGenericTypes to check inside Promise

    // Generator with inline return type (needs both options)
    // Note: Generator<{ value: number }> requires checkGenericTypes to check inside Generator

    // Method with inline return type (outside class)
    {
      code: `const obj = { getData(): { id: string } { return { id: '' }; } };`,
      options: [{ checkReturnTypes: true }],
      errors: ["noInlineInterfaces"],
    },
  ],
});

// Test with checkGenericTypes: true
run({
  name: "no-inline-interfaces (checkGenericTypes: true)",
  rule,
  languageOptions: {
    parser: typescriptParser,
  },

  valid: [
    // Generic types with named types are valid
    {
      code: `type Item = { id: string }
const items: Array<Item> = [];`,
      options: [{ checkGenericTypes: true }],
    },

    {
      code: `interface Data { value: number }
const readonly: Readonly<Data> = { value: 0 };`,
      options: [{ checkGenericTypes: true }],
    },

    // Nested generics with named types
    {
      code: `interface Item { id: string }
const data: Promise<Array<Item>> = Promise.resolve([]);`,
      options: [{ checkGenericTypes: true }],
    },

    // Map with named types
    {
      code: `interface Value { data: string }
const map: Map<string, Value> = new Map();`,
      options: [{ checkGenericTypes: true }],
    },

    // Set with named types
    {
      code: `interface Item { id: string }
const set: Set<Item> = new Set();`,
      options: [{ checkGenericTypes: true }],
    },
  ],

  invalid: [
    // Array with inline object type in generic
    {
      code: `const x: Array<{ a: string }> = [];`,
      options: [{ checkGenericTypes: true }],
      errors: ["noInlineInterfaces"],
    },

    // Readonly with inline object type
    {
      code: `const x: Readonly<{ a: string }> = { a: '' };`,
      options: [{ checkGenericTypes: true }],
      errors: ["noInlineInterfaces"],
    },

    // Promise with inline object type
    {
      code: `const y: Promise<{ a: string }> = Promise.resolve({ a: '' });`,
      options: [{ checkGenericTypes: true }],
      errors: ["noInlineInterfaces"],
    },

    // Partial with inline object type
    {
      code: `const y: Partial<{ a: string }> = {};`,
      options: [{ checkGenericTypes: true }],
      errors: ["noInlineInterfaces"],
    },

    // Record with inline object type in value
    {
      code: `const x: Record<string, { a: string }> = {};`,
      options: [{ checkGenericTypes: true }],
      errors: ["noInlineInterfaces"],
    },

    // Map with inline object type
    {
      code: `const map: Map<string, { value: number }> = new Map();`,
      options: [{ checkGenericTypes: true }],
      errors: ["noInlineInterfaces"],
    },

    // Set with inline object type
    {
      code: `const set: Set<{ id: string }> = new Set();`,
      options: [{ checkGenericTypes: true }],
      errors: ["noInlineInterfaces"],
    },

    // WeakMap with inline object type
    {
      code: `const map: WeakMap<object, { data: string }> = new WeakMap();`,
      options: [{ checkGenericTypes: true }],
      errors: ["noInlineInterfaces"],
    },

    // Nested generics with inline types
    {
      code: `const nested: Promise<Array<{ item: string }>> = Promise.resolve([]);`,
      options: [{ checkGenericTypes: true }],
      errors: ["noInlineInterfaces"],
    },

    // Multiple inline types in generic
    {
      code: `const x: Map<{ key: string }, { value: number }> = new Map();`,
      options: [{ checkGenericTypes: true }],
      errors: ["noInlineInterfaces", "noInlineInterfaces"],
    },

    // Required with inline object
    {
      code: `const x: Required<{ a?: string }> = { a: '' };`,
      options: [{ checkGenericTypes: true }],
      errors: ["noInlineInterfaces"],
    },

    // NonNullable with inline object union
    {
      code: `const x: NonNullable<{ a: string } | null> = { a: '' };`,
      options: [{ checkGenericTypes: true }],
      errors: ["noInlineInterfaces"],
    },
  ],
});

// Test with both options enabled
run({
  name: "no-inline-interfaces (all options enabled)",
  rule,
  languageOptions: {
    parser: typescriptParser,
  },

  valid: [
    // Named types in return with generics are valid
    {
      code: `interface Data { value: string }
function getData(): Promise<Data> { return Promise.resolve({ value: '' }); }`,
      options: [{ checkGenericTypes: true, checkReturnTypes: true }],
    },

    // Union of named types in return
    {
      code: `interface A { a: string }
interface B { b: number }
function get(): A | B | null { return null; }`,
      options: [{ checkGenericTypes: true, checkReturnTypes: true }],
    },
  ],

  invalid: [
    // Return type with generic containing inline object
    // Requires BOTH options: checkReturnTypes to check returns, checkGenericTypes to look inside Promise<...>
    {
      code: `function getData(): Promise<{ data: string }> { return Promise.resolve({ data: '' }); }`,
      options: [{ checkGenericTypes: true, checkReturnTypes: true }],
      errors: ["noInlineInterfaces"],
    },

    // Return type that is itself inline (async function)
    // Requires BOTH options: checkReturnTypes to check returns, checkGenericTypes to look inside Promise<...>
    {
      code: `async function getUser(): Promise<{ id: string; name: string }> { return { id: '', name: '' }; }`,
      options: [{ checkGenericTypes: true, checkReturnTypes: true }],
      errors: ["noInlineInterfaces"],
    },

    // Generator return type with inline object in generic
    {
      code: `function* gen(): Generator<{ value: number }> { yield { value: 1 }; }`,
      options: [{ checkGenericTypes: true, checkReturnTypes: true }],
      errors: ["noInlineInterfaces"],
    },

    // Return with union containing inline objects
    {
      code: `function get(): { a: string } | { b: number } { return { a: '' }; }`,
      options: [{ checkGenericTypes: true, checkReturnTypes: true }],
      errors: ["noInlineInterfaces", "noInlineInterfaces"],
    },

    // Parameter and return both with inline types
    {
      code: `function process(input: { x: number }): { result: number } { return { result: input.x * 2 }; }`,
      options: [{ checkGenericTypes: true, checkReturnTypes: true }],
      errors: ["noInlineInterfaces", "noInlineInterfaces"],
    },

    // Generic return with nested inline objects
    {
      code: `function getData(): Array<{ items: { id: string }[] }> { return []; }`,
      options: [{ checkGenericTypes: true, checkReturnTypes: true }],
      errors: ["noInlineInterfaces", "noInlineInterfaces"],
    },
  ],
});

# Disallow inline object type literals in annotations

This rule enforces extracting inline object type literals into named interfaces or type aliases, rather than defining them inline in variable declarations, function parameters, or return types.

## Rationale

Extracting object types into named interfaces or type aliases:

- Improves code readability and maintainability
- Encourages type reusability across the codebase
- Makes complex types easier to understand and document
- Facilitates refactoring and type updates

## Rule Details

This rule flags inline object type literals (`{ prop: type }`) when used in:

- Variable type annotations
- Function parameter type annotations (including destructured parameters)
- Function return type annotations (only when `checkReturnTypes: true`)

The rule will flag object literals even when they appear within:

- Union types (e.g., `{ a: string } | null`)
- Intersection types (e.g., `A & { b: number }`)
- Array types using bracket syntax (e.g., `{ a: string }[]`)
- Tuple types (e.g., `[{ a: string }, number]`)

### Options

This rule accepts an options object with the following properties:

```typescript
{
  checkGenericTypes?: boolean; // default: false
  checkReturnTypes?: boolean; // default: false
}
```

#### `checkGenericTypes` (default: `false`)

When `false` (default), the rule ignores inline object types within generic type arguments of type references (e.g., `Readonly<{ a: string }>`, `Promise<{ data: number }>`, `Array<{ a: string }>`).

When `true`, the rule will flag inline object types even inside generic type arguments.

#### `checkReturnTypes` (default: `false`)

When `false` (default), the rule does NOT check function return type annotations.

When `true`, the rule will flag inline object types in function return types.

### What the rule always ignores

**Classes:** The rule completely ignores anything inside classes, including class properties, method parameters, and method return types. This allows for flexibility in class-based code where inline types may be more appropriate.

## Examples

### ❌ Invalid

```typescript
// Variable with inline object type
const myVariable: { prop1: string; prop2: number } = {} as any;

// Arrow function with inline object type on destructured params
export const MyReactComponent = ({
  prop1,
  prop2,
}: {
  prop1: string;
  prop2: number;
}) => {};

// Arrow function with inline object type on props param
export const MyReactComponent = (props: { prop1: string; prop2: number }) => {};

// Function declaration with inline object type
function MyReactComponent({ prop1, prop2 }: { prop1: string; prop2: number }) {}

// Union with inline object type
const data: { id: number } | null = null;

// Intersection with inline object types
const combined: { a: string } & { b: number } = {} as any;
```

**With `checkReturnTypes: true`:**

```typescript
// Function with inline return type
function getData(): { name: string; age: number } {
  return { name: "John", age: 30 };
}

// Arrow function with inline return type
const getUser = (): { id: string; name: string } => ({ id: "", name: "" });
```

**With `checkGenericTypes: true`:**

```typescript
// Generic type with inline object
const items: Array<{ id: string }> = [];

// Readonly with inline object
const config: Readonly<{ debug: boolean }> = { debug: true };

// Promise with inline object
const data: Promise<{ result: number }> = Promise.resolve({ result: 42 });
```

### ✅ Valid

```typescript
// Using interface
interface MyInterface {
  prop1: string;
  prop2: number;
}

const myVariable: MyInterface = {} as any;
export const MyReactComponent = ({ prop1, prop2 }: MyInterface) => {};
export const MyReactComponent2 = (props: MyInterface) => {};
function MyFunction(props: MyInterface) {}

// Using type alias
type MyType = {
  prop1: string;
  prop2: number;
};

const myVariable: MyType = {} as any;
export const MyComponent = (props: MyType) => {};

// Return type with named type
type ReturnType = { name: string; age: number };
function getData(): ReturnType {
  return { name: "John", age: 30 };
}

// Union with named types
interface Data {
  id: number;
}
const data: Data | null = null;

// Primitives and other types
const name: string = "";
const count: number = 0;
const items: string[] = [];

// Generic type arguments are ignored
const readonly: Readonly<{ a: string }> = { a: "" };
const promise: Promise<{ data: number }> = Promise.resolve({ data: 1 });

// Classes are completely ignored
class User {
  // Inline types in class properties are allowed
  data: { name: string; age: number };

  // Inline types in class methods are allowed
  process(config: { debug: boolean; verbose: boolean }) {}

  getData(): { id: string; value: number } {
    return { id: "", value: 0 };
  }
}
```

## Configuration Examples

### Default Configuration (Recommended)

```javascript
// eslint.config.js
export default [
  {
    rules: {
      "fsecond/no-inline-interfaces": "error",
    },
  },
];
```

This will check variables and function parameters, but NOT return types or generic type arguments.

### Strict Configuration

```javascript
// eslint.config.js
export default [
  {
    rules: {
      "fsecond/no-inline-interfaces": [
        "error",
        {
          checkReturnTypes: true,
          checkGenericTypes: true,
        },
      ],
    },
  },
];
```

This will check all inline object types including return types and those inside generics.

### Check Only Return Types

```javascript
// eslint.config.js
export default [
  {
    rules: {
      "fsecond/no-inline-interfaces": [
        "error",
        {
          checkReturnTypes: true,
        },
      ],
    },
  },
];
```

## When Not To Use It

If your codebase prefers inline type definitions for simple, one-off types that are only used in a single location, you may want to disable this rule.

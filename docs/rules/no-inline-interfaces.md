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
- Function return type annotations

The rule will flag object literals even when they appear within:

- Union types (e.g., `{ a: string } | null`)
- Intersection types (e.g., `A & { b: number }`)
- Array types using bracket syntax (e.g., `{ a: string }[]`)
- Tuple types (e.g., `[{ a: string }, number]`)

### What the rule ignores

**Classes:** The rule completely ignores anything inside classes, including class properties, method parameters, and method return types. This allows for flexibility in class-based code where inline types may be more appropriate.

**Generic type arguments:** The rule ignores inline object types within generic type arguments of type references (e.g., `Readonly<{ a: string }>`, `Promise<{ data: number }>`, `Array<{ a: string }>`).

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

// Function with inline return type
function getData(): { name: string; age: number } {
  return { name: "John", age: 30 };
}

// Union with inline object type
const data: { id: number } | null = null;

// Intersection with inline object types
const combined: { a: string } & { b: number } = {} as any;
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

## When Not To Use It

If your codebase prefers inline type definitions for simple, one-off types that are only used in a single location, you may want to disable this rule.

<!-- end auto-generated rule header -->

## Description

Enforces a strict function parameter style where required parameters come first, followed by an optional destructured object parameter as the final parameter.

This rule enforces two key constraints:

1. **No inline optional parameters** - Optional parameters (those with `?` or default values) must NOT appear directly in the function signature. They must be moved into a destructured object parameter.

2. **Destructured object must be last** - If a destructured object parameter is present, it must be the final parameter (nothing can come after it).

## Rationale

This rule promotes consistency and clarity in function signatures by:

- **Grouping related optional parameters** - Optional parameters are collected in a single destructured object rather than scattered across the signature
- **Clear visual separation** - Required parameters are distinct from optional ones, making the function contract easier to understand
- **Better maintainability** - Adding or removing optional parameters doesn't affect required parameters. It's easier to maintain a function if the changing the order of the parameters doesn't affect the function signature.
- **Improved type safety** - Optional parameters in a destructured object are easier to type correctly

## Options

<!-- begin auto-generated rule options list -->
<!-- end auto-generated rule options list -->

## Fail

### Optional parameter in signature

```js
const myFn = (param1, optionalParam = "x") => {
  console.log(param1, optionalParam);
};
```

```js
function process(name, callback?) {
  callback?.();
}
```

### Destructured object not at the end

```js
const myFn = (param1, { optionalParam1 = "default" }, param2) => {
  console.log(param1, optionalParam1, param2);
};
```

### Multiple optional parameters in signature

```js
const myFn = (param1, optionalParam1?, optionalParam2 = "default") => {
  console.log(param1, optionalParam1, optionalParam2);
};
```

## Pass

### Required parameters followed by destructured object

```js
const myFn = (param1, param2, { optionalParam = "x" }) => {
  console.log(param1, param2, optionalParam);
};
```

### Multiple optional parameters in destructured object

```js
const myFn = (
  param1,
  param2,
  { optionalParam1 = "default", optionalParam2 = 42 },
) => {
  console.log(param1, param2, optionalParam1, optionalParam2);
};
```

### Only destructured optional parameters

```js
const myFn = ({ optionalParam1 = "default", optionalParam2 = 42 } = {}) => {
  console.log(optionalParam1, optionalParam2);
};
```

### No optional parameters (all required)

```js
const myFn = (param1, param2) => {
  console.log(param1, param2);
};
```

### With TypeScript type annotations

```ts
const writeJSONToFile = (
  inputFilePath: string,
  outputFilePath: string,
  { discardUnmappedColumns = false }: { discardUnmappedColumns?: boolean } = {},
) => {
  // implementation
};
```

## When Not To Use

- If your project prefers flexible parameter ordering
- If you want to allow optional parameters to be interspersed with required ones
- If you're refactoring legacy code with many optional parameters

# Enforces a specific style for the anatomy of a function signature

This rule enforce that required parameters should always be placed at the start of the function signature and optional parameters should always be placed at the end of the function signature, in the form of a destructured object.

## Fail

```js
const myFn = (param1, optionalParam = "x") => {
  console.log(param1, optionalParam);
};
```

```js
const myFn = (param1, { optionalParam1 = "default" }, param2) => {
  console.log(param1, optionalParam1, param2);
};
```

## Pass

```js
const myFn = (param1, param2, { optionalParam = "x" }) => {
  console.log(param1, param2, optionalParam);
};
```

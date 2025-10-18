# Enforces best practices around addEventListener method in React components (`fsecond/valid-event-listener`)

💼 This rule is enabled in the ✅ `recommended` config.

<!-- end auto-generated rule header -->

## Description

This rule enforces best practices for event listeners in React components. It specifically targets `useEffect` hooks where event listeners are commonly added and removed.

This rule enforces best practices for event listeners in React components:

- enforces the use of a useEventListener hook from a React hooks library instead of manually adding and removing event listeners (_optional_. `true` by default)
- every addEventListener in useEffect should have a cleanup function
- every addEventListener should have a matching removeEventListener in the returned cleanup function of the same useEffect block
- addEventListener methods should not be called conditionally in React components

**Note on AbortSignal:** If all `addEventListener` calls in a useEffect use the `{ once: true }` option, the cleanup requirement is waived. This is safe for patterns like `AbortSignal.abort()` events, which fire at most once and automatically remove themselves after the first invocation.

## Rationale

This rule promotes consistency and correctness in event listener management in React components by:

- **Use of useEventListener hook** - Encourages the use of a useEventListener hook from a React hooks library instead of manually adding and removing event listeners
- **Cleanup requirement** - Enforces that every addEventListener in useEffect should have a cleanup function
- **Matching removeEventListener** - Enforces that every addEventListener should have a matching removeEventListener in the returned cleanup function of the same useEffect block
- **Conditional addEventListener** - Enforces that addEventListener methods should not be called conditionally in React components

## Options

<!-- begin auto-generated rule options list -->

| Name                          | Description                                | Type    |
| :---------------------------- | :----------------------------------------- | :------ |
| `requireUseEventListenerHook` | Require the use of a useEventListener hook | Boolean |

<!-- end auto-generated rule options list -->

### requireUseEventListenerHook

Type: `boolean`\
Default: `true`

A lot of React hooks libraries provide a `useEventListener` hook that simplifies event listener management in React components. This rule can enforce the use of such a hook instead of manually adding and removing event listeners in useEffect.

This option is set to `true` by default. Setting this to false will disable this check but the other checks around addEventListener usage correctness in React components will still be enforced.

## Examples

### ❌ Invalid

```js
// eslint fsecond/valid-event-listener: [2, {"requireUseEventListenerHook": false}]
useEffect(() => {
  doThis();
  if (x) window.document.addEventListener("keydown", handleUserKeyPress);
}, []);
```

```js
// eslint fsecond/valid-event-listener: [2, {"requireUseEventListenerHook": false}]
useEffect(() => {
  doThis();
  x && window.document.addEventListener("keydown", handleUserKeyPress);
}, []);
```

```js
// eslint fsecond/valid-event-listener: [2, {"requireUseEventListenerHook": false}]
useEffect(() => {
  doThis();
  if (x) {
    window.document.addEventListener("keydown", handleUserKeyPress);
  }
}, []);
```

```js
// eslint fsecond/valid-event-listener: [2, {"requireUseEventListenerHook": false}]
useEffect(() => {
  doThis();
  if (x) {
    x();
  } else {
    window.document.addEventListener("keydown", handleUserKeyPress);
  }
}, []);
```

```js
// eslint fsecond/valid-event-listener: [2, {"requireUseEventListenerHook": false}]
useEffect(() => {
  doThis();
  if (x) {
    doThisMore();
  }
  window.document.addEventListener("keydown", handleUserKeyPress);
}, []);
```

```js
// eslint fsecond/valid-event-listener: [2, {"requireUseEventListenerHook": false}]
useEffect(() => {
  doThis();
  if (x) {
    doThisMore();
  }
  window.document.addEventListener("keydown", handleUserKeyPress);
  doMoreOfThis();
  return () => {
    if (x) {
      doThisMore();
    }
    doThatAfter();
  };
}, []);
```

```js
// eslint fsecond/valid-event-listener: 2
// eslint fsecond/valid-event-listener: [2, {"requireUseEventListenerHook": true}]
useEffect(() => {
  window.addEventListener("keydown", handleUserKeyPress);
  return () => {
    window.removeEventListener("keydown", handleUserKeyPress);
  };
}, []);
```

### ✅ Valid

```js
// eslint fsecond/valid-event-listener: 2
// eslint fsecond/valid-event-listener: [2, {"requireUseEventListenerHook": true}]
useEventListener("scroll", onScroll);
```

```js
// eslint fsecond/valid-event-listener: 2
// eslint fsecond/valid-event-listener: [2, {"requireUseEventListenerHook": true}]
useEventListener("visibilitychange", onVisibilityChange, documentRef);
```

```js
// eslint fsecond/valid-event-listener: 2
// eslint fsecond/valid-event-listener: [2, {"requireUseEventListenerHook": true}]
useEventListener("click", onClick, buttonRef);
```

```js
// eslint fsecond/valid-event-listener: 2
// eslint fsecond/valid-event-listener: [2, {"requireUseEventListenerHook": true}]
useEffect(() => {
  return () => {
    window.removeEventListener("keydown", handleUserKeyPress);
  };
}, []);
```

```js
// eslint fsecond/valid-event-listener: 2
// eslint fsecond/valid-event-listener: [2, {"requireUseEventListenerHook": true}]
// eslint fsecond/valid-event-listener: [2, {"requireUseEventListenerHook": false}]
useEffect(() => {
  refcurrent = value;
}, [value]);
```

```js
// eslint fsecond/valid-event-listener: [2, {"requireUseEventListenerHook": false}]
useEffect(() => {
  window.document.addEventListener("keydown", handleUserKeyPress);
  return () => {
    window.document.removeEventListener("keydown", handleUserKeyPress);
  };
}, []);
```

## When Not To Use

- If you're not using React
- If you are not using React hooks

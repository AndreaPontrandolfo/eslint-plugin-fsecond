# Enforces best practices around addEventListener method

This rule enforces 3 things:

- enforces the use of a useEventListener hook from a hooks library instead of manually adding and removing event listeners (_optional_. `true` by default)
- every addEventListener should have a cleanup function
- every addEventListener should have a matching removeEventListener in the returned cleanup function of same useEffect block
- addEventListener methods should not be called conditionally

## Options

### requireUseEventListenerHook

Type: `boolean`\
Default: `true`

A lot of react-hooks libraries provide a `useEventListener` hook that simplifies event-listeners management. This rule can enforce the use of such a hook instead of manually adding and removing event listeners.

This option is set to `true` by default. Setting this to false will disable this check but the other checks around addEventListener usage correctness will still be enforced.

## Fail

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

## Pass

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

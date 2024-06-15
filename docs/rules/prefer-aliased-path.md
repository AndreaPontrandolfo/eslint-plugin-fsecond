# Suggest using a package.json alias subpath import instead of a relative import

This rule enforce to prefer using a [package.json alias subpath import](https://nodejs.org/api/packages.html#imports) path instead of a relative path, where possible.

## Examples

Given package.json:

```json
{
  "name": "dummy-package-json",
  "imports": {
    "#helpers/*": "./src/helpers/*.ts"
  }
}
```

### Fail

```js
import { myHelper } from "./src/helpers/myHelper";
```

### Pass

```js
import { myHelper } from "#helpers/myHelper";
```

```js
import { myHook } from "./hooks/myHook";
```

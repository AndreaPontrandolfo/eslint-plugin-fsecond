# fsecond/no-redundant-jsx-prop-usage

📝 Disallow passing a JSX prop whose value matches the component's destructuring default for that prop.

💼 This rule is enabled in the ☑️ `recommendedTypeChecked` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

<!-- end auto-generated rule header -->

## Description

When a React component defines a destructuring default for a prop, passing that exact default value explicitly at the call site is redundant. The component will use that value anyway if you omit the prop entirely.

This rule flags JSX attributes whose literal value matches the destructuring default of the corresponding prop in the component's definition, including when the component is imported from another file.

**Note:** This rule only detects defaults defined via destructuring parameter syntax (`{ foo = "bar" }`). Legacy `defaultProps` is not supported. Only primitive literal comparisons (string, number, boolean, `null`, `undefined`) are performed — objects and arrays are ignored.

## Rationale

Passing the default value explicitly:

- Adds noise to JSX call sites without changing behavior
- Makes it harder to see which props are actually being customized
- Creates maintenance burden — if the default changes, all call sites passing the old default need updating

## Examples

### ❌ Invalid

```tsx
// Button.tsx
export function Button({ variant = "primary" }: { variant?: string }) {
  return <button className={variant} />;
}

// Page.tsx
import { Button } from "./Button";

// "primary" is already the default for `variant` — this is redundant
const x = <Button variant="primary" />;
```

```tsx
function Counter({ count = 0 }: { count?: number }) {
  return <span>{count}</span>;
}

// 0 is already the default for `count`
const x = <Counter count={0} />;
```

```tsx
function Toggle({ enabled = true }: { enabled?: boolean }) {
  return <div>{enabled ? "on" : "off"}</div>;
}

// Both of these are redundant (boolean shorthand is treated as `true`)
const a = <Toggle enabled={true} />;
const b = <Toggle enabled />;
```

```tsx
const Input = React.forwardRef(
  ({ placeholder = "Search..." }: { placeholder?: string }, ref) => (
    <input ref={ref} placeholder={placeholder} />
  ),
);

// "Search..." is already the default for `placeholder`
const x = <Input placeholder="Search..." />;
```

### ✅ Valid

```tsx
function Button({ variant = "primary" }: { variant?: string }) {
  return <button className={variant} />;
}

// Different value — intentionally overriding the default
const x = <Button variant="secondary" />;

// Omitting the prop — uses the default implicitly
const y = <Button />;
```

```tsx
function Counter({ count = 0 }: { count?: number }) {
  return <span>{count}</span>;
}

// Dynamic value — cannot be statically compared
const val = 0;
const x = <Counter count={val} />;
```

```tsx
function Toggle({ enabled = false }: { enabled?: boolean }) {
  return <div>{enabled ? "on" : "off"}</div>;
}

// Boolean shorthand = true, but default is false — not redundant
const x = <Toggle enabled />;
```

```tsx
// Intrinsic HTML elements are always ignored
const x = <div className="foo" />;
const y = <input type="text" />;
```

## Configuration

This rule requires typed linting. Add `parserOptions.project` or `parserOptions.projectService` to your ESLint config:

```javascript
// eslint.config.js
import tseslint from "typescript-eslint";
import fsecond from "eslint-plugin-fsecond";

export default tseslint.config({
  extends: [
    ...tseslint.configs.recommended,
    ...fsecond.configs.recommendedTypeChecked,
  ],
  languageOptions: {
    parserOptions: {
      projectService: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

Or enable the rule individually:

```javascript
// eslint.config.js
export default [
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "fsecond/no-redundant-jsx-prop-usage": "error",
    },
  },
];
```

## Limitations

- **Destructuring defaults only:** Defaults defined via `Comp.defaultProps` are not detected.
- **Primitive literals only:** Object and array defaults (e.g., `{ items = [] }`) are not compared.
- **Source declarations only:** Components whose types come only from `.d.ts` files (no source `.tsx`/`.ts` available) cannot be analyzed, so the rule silently skips them.

## When Not To Use It

Disable this rule if your team intentionally passes default values at call sites for documentation or readability purposes.

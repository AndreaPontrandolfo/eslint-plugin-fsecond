import { run } from "eslint-vitest-rule-tester";
import typescriptParser from "@typescript-eslint/parser";
import rule from "./no-redundant-jsx-prop-usage";

await run({
  name: "no-redundant-jsx-prop-usage",
  rule,
  languageOptions: {
    parser: typescriptParser,
    parserOptions: {
      projectService: {
        allowDefaultProject: ["*.tsx", "*.ts"],
        defaultProject: "tsconfig.json",
      },
      tsconfigRootDir: process.cwd(),
      ecmaFeatures: { jsx: true },
    },
  },

  valid: [
    // Value differs from string default
    {
      filename: "test.tsx",
      code: `
        function Button({ variant = "primary" }: { variant?: string }) {
          return <button />;
        }
        const x = <Button variant="secondary" />;
      `,
    },

    // Prop omitted entirely — no violation
    {
      filename: "test.tsx",
      code: `
        function Button({ variant = "primary" }: { variant?: string }) {
          return <button />;
        }
        const x = <Button />;
      `,
    },

    // No default for the prop
    {
      filename: "test.tsx",
      code: `
        function Button({ variant }: { variant: string }) {
          return <button />;
        }
        const x = <Button variant="primary" />;
      `,
    },

    // Non-primitive default (array) — skipped, no comparison
    {
      filename: "test.tsx",
      code: `
        function List({ items = [] }: { items?: string[] }) {
          return <ul />;
        }
        const x = <List items={[]} />;
      `,
    },

    // Non-primitive default (object) — skipped, no comparison
    {
      filename: "test.tsx",
      code: `
        function Card({ style = {} }: { style?: object }) {
          return <div />;
        }
        const x = <Card style={{}} />;
      `,
    },

    // Intrinsic HTML element (lowercase) — always ignored
    {
      filename: "test.tsx",
      code: `const x = <div className="foo" />;`,
    },

    {
      filename: "test.tsx",
      code: `const x = <input type="text" />;`,
    },

    // Props object not destructured — cannot extract defaults
    {
      filename: "test.tsx",
      code: `
        function Button(props: { variant?: string }) {
          return <button />;
        }
        const x = <Button variant="primary" />;
      `,
    },

    // Dynamic value — not a literal, cannot compare
    {
      filename: "test.tsx",
      code: `
        function Button({ variant = "primary" }: { variant?: string }) {
          return <button />;
        }
        const v = "primary";
        const x = <Button variant={v} />;
      `,
    },

    // Boolean shorthand where default is false — shorthand means true, not a match
    {
      filename: "test.tsx",
      code: `
        function Toggle({ enabled = false }: { enabled?: boolean }) {
          return <div />;
        }
        const x = <Toggle enabled />;
      `,
    },

    // Value differs from number default
    {
      filename: "test.tsx",
      code: `
        function Counter({ count = 0 }: { count?: number }) {
          return <span />;
        }
        const x = <Counter count={1} />;
      `,
    },

    // Value differs from boolean default
    {
      filename: "test.tsx",
      code: `
        function Toggle({ enabled = true }: { enabled?: boolean }) {
          return <div />;
        }
        const x = <Toggle enabled={false} />;
      `,
    },

    // Negative number default — value differs
    {
      filename: "test.tsx",
      code: `
        function Slider({ min = -10 }: { min?: number }) {
          return <input />;
        }
        const x = <Slider min={-5} />;
      `,
    },

    // Spread attribute — spread is not a JSXAttribute, ignored gracefully
    {
      filename: "test.tsx",
      code: `
        function Button({ variant = "primary" }: { variant?: string }) {
          return <button />;
        }
        const props = {};
        const x = <Button {...props} />;
      `,
    },

    // null default — different value passed
    {
      filename: "test.tsx",
      code: `
        function Modal({ title = null }: { title?: string | null }) {
          return <div />;
        }
        const x = <Modal title="hello" />;
      `,
    },
  ],

  invalid: [
    // String default matches
    {
      filename: "test.tsx",
      code: `
        function Button({ variant = "primary" }: { variant?: string }) {
          return <button />;
        }
        const x = <Button variant="primary" />;
      `,
      errors: [{ messageId: "noRedundantJsxPropUsage" }],
    },

    // Number default matches (expression container)
    {
      filename: "test.tsx",
      code: `
        function Counter({ count = 0 }: { count?: number }) {
          return <span />;
        }
        const x = <Counter count={0} />;
      `,
      errors: [{ messageId: "noRedundantJsxPropUsage" }],
    },

    // Boolean default true — explicit {true}
    {
      filename: "test.tsx",
      code: `
        function Toggle({ enabled = true }: { enabled?: boolean }) {
          return <div />;
        }
        const x = <Toggle enabled={true} />;
      `,
      errors: [{ messageId: "noRedundantJsxPropUsage" }],
    },

    // Boolean default true — shorthand (means true)
    {
      filename: "test.tsx",
      code: `
        function Toggle({ enabled = true }: { enabled?: boolean }) {
          return <div />;
        }
        const x = <Toggle enabled />;
      `,
      errors: [{ messageId: "noRedundantJsxPropUsage" }],
    },

    // Boolean default false — explicit {false}
    {
      filename: "test.tsx",
      code: `
        function Toggle({ enabled = false }: { enabled?: boolean }) {
          return <div />;
        }
        const x = <Toggle enabled={false} />;
      `,
      errors: [{ messageId: "noRedundantJsxPropUsage" }],
    },

    // null default matches
    {
      filename: "test.tsx",
      code: `
        function Modal({ title = null }: { title?: string | null }) {
          return <div />;
        }
        const x = <Modal title={null} />;
      `,
      errors: [{ messageId: "noRedundantJsxPropUsage" }],
    },

    // Negative number default matches
    {
      filename: "test.tsx",
      code: `
        function Slider({ min = -10 }: { min?: number }) {
          return <input />;
        }
        const x = <Slider min={-10} />;
      `,
      errors: [{ messageId: "noRedundantJsxPropUsage" }],
    },

    // Arrow function component
    {
      filename: "test.tsx",
      code: `
        const Button = ({ variant = "primary" }: { variant?: string }) => <button />;
        const x = <Button variant="primary" />;
      `,
      errors: [{ messageId: "noRedundantJsxPropUsage" }],
    },

    // Arrow function assigned to variable with type annotation
    {
      filename: "test.tsx",
      code: `
        const Counter = ({ count = 0 }: { count?: number }): JSX.Element => <span />;
        const x = <Counter count={0} />;
      `,
      errors: [{ messageId: "noRedundantJsxPropUsage" }],
    },

    // React.forwardRef wrapped component
    {
      filename: "test.tsx",
      code: `
        import React from "react";
        const Input = React.forwardRef(
          ({ placeholder = "Search..." }: { placeholder?: string }, ref: React.Ref<HTMLInputElement>) =>
            <input ref={ref} placeholder={placeholder} />,
        );
        const x = <Input placeholder="Search..." />;
      `,
      errors: [{ messageId: "noRedundantJsxPropUsage" }],
    },

    // Multiple redundant props on the same element — two errors
    {
      filename: "test.tsx",
      code: `
        function Card({ title = "Untitled", count = 0 }: { title?: string; count?: number }) {
          return <div />;
        }
        const x = <Card title="Untitled" count={0} />;
      `,
      errors: [
        { messageId: "noRedundantJsxPropUsage" },
        { messageId: "noRedundantJsxPropUsage" },
      ],
    },

    // Only one of two props is redundant — one error
    {
      filename: "test.tsx",
      code: `
        function Card({ title = "Untitled", count = 0 }: { title?: string; count?: number }) {
          return <div />;
        }
        const x = <Card title="Untitled" count={99} />;
      `,
      errors: [{ messageId: "noRedundantJsxPropUsage" }],
    },
  ],
});

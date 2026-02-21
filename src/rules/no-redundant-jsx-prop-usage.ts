import * as ts from "typescript";
import {
  AST_NODE_TYPES,
  ESLintUtils,
  type TSESTree,
} from "@typescript-eslint/utils";
import { createEslintRule } from "../utils";

const RULE_NAME = "no-redundant-jsx-prop-usage";

type MessageIds = "noRedundantJsxPropUsage";
type Options = [];

// Sentinel value to distinguish "not a comparable primitive" from a real value
const SKIP = Symbol("SKIP");

type PrimitiveValue = string | number | boolean | null | undefined;

/**
 * Extracts a primitive literal value from a TypeScript AST expression node.
 * Returns SKIP if the expression is not a primitive literal we can compare.
 */
const extractPrimitiveLiteral = (
  node: ts.Expression,
): PrimitiveValue | typeof SKIP => {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return node.text;
  }
  if (ts.isNumericLiteral(node)) {
    return Number(node.text);
  }
  if (node.kind === ts.SyntaxKind.TrueKeyword) {
    return true;
  }
  if (node.kind === ts.SyntaxKind.FalseKeyword) {
    return false;
  }
  if (node.kind === ts.SyntaxKind.NullKeyword) {
    return null;
  }
  if (ts.isIdentifier(node) && node.text === "undefined") {
    return undefined;
  }
  // Negative numbers: -42
  if (
    ts.isPrefixUnaryExpression(node) &&
    node.operator === ts.SyntaxKind.MinusToken &&
    ts.isNumericLiteral(node.operand)
  ) {
    return -Number(node.operand.text);
  }

  return SKIP;
};

/**
 * If the call expression is React.forwardRef(...) or forwardRef(...),
 * returns the inner function (the actual component). Otherwise returns undefined.
 */
const unwrapForwardRef = (
  callExpr: ts.CallExpression,
): ts.ArrowFunction | ts.FunctionExpression | undefined => {
  const callee = callExpr.expression;
  let funcName: string | undefined;

  if (ts.isIdentifier(callee)) {
    funcName = callee.text;
  } else if (
    ts.isPropertyAccessExpression(callee) &&
    ts.isIdentifier(callee.name)
  ) {
    funcName = callee.name.text;
  }

  if (funcName === "forwardRef") {
    const firstArg = callExpr.arguments[0];

    if (ts.isArrowFunction(firstArg) || ts.isFunctionExpression(firstArg)) {
      return firstArg;
    }
  }

  return undefined;
};

/**
 * Given a TypeScript declaration node, attempts to find the function-like node
 * that represents the React component. Returns a Map of prop name -\> default value,
 * or null if the declaration cannot be analyzed.
 */
const extractDefaultsFromDeclaration = (
  decl: ts.Declaration,
): Map<string, PrimitiveValue> | null => {
  let functionNode: ts.FunctionLikeDeclaration | undefined;

  if (
    ts.isFunctionDeclaration(decl) ||
    ts.isFunctionExpression(decl) ||
    ts.isArrowFunction(decl)
  ) {
    functionNode = decl;
  } else if (ts.isVariableDeclaration(decl)) {
    const init = decl.initializer;

    if (!init) {
      return null;
    }
    if (ts.isArrowFunction(init) || ts.isFunctionExpression(init)) {
      functionNode = init;
    } else if (ts.isCallExpression(init)) {
      // Handle React.forwardRef(...)
      const inner = unwrapForwardRef(init);

      if (inner) {
        functionNode = inner;
      }
    }
  }

  if (!functionNode) {
    return null;
  }

  const firstParam = functionNode.parameters[0];

  // Parameters array can be empty for zero-argument functions
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!firstParam) {
    return null;
  }

  const bindingPattern = firstParam.name;

  if (!ts.isObjectBindingPattern(bindingPattern)) {
    return null;
  }

  const defaults = new Map<string, PrimitiveValue>();

  for (const element of bindingPattern.elements) {
    if (!element.initializer) {
      continue;
    }

    // The prop name is either the property name (for renamed bindings: { foo: bar = "x" })
    // or the element name itself (for simple bindings: { foo = "x" })
    let propName: string | undefined;

    if (element.propertyName) {
      if (ts.isIdentifier(element.propertyName)) {
        propName = element.propertyName.text;
      }
    } else if (ts.isIdentifier(element.name)) {
      propName = element.name.text;
    }

    if (!propName) {
      continue;
    }

    const defaultValue = extractPrimitiveLiteral(element.initializer);

    if (defaultValue !== SKIP) {
      defaults.set(propName, defaultValue);
    }
  }

  return defaults;
};

/**
 * Extracts a primitive value from a JSX attribute value (ESTree side).
 * Returns SKIP if the value is not a comparable primitive literal.
 */
const getJSXAttributePrimitiveValue = (
  attr: TSESTree.JSXAttribute,
): PrimitiveValue | typeof SKIP => {
  const { value } = attr;

  // Boolean shorthand: <Button disabled /> means disabled={true}
  if (value === null) {
    return true;
  }

  // String literal: <Button variant="primary" />
  if (value.type === AST_NODE_TYPES.Literal) {
    const v = value.value;

    if (
      typeof v === "string" ||
      typeof v === "number" ||
      typeof v === "boolean" ||
      v === null
    ) {
      return v;
    }

    return SKIP;
  }

  // JSX expression container: <Button count={42} />
  if (value.type === AST_NODE_TYPES.JSXExpressionContainer) {
    const expr = value.expression;

    if (expr.type === AST_NODE_TYPES.Literal) {
      const v = expr.value;

      if (
        typeof v === "string" ||
        typeof v === "number" ||
        typeof v === "boolean" ||
        v === null
      ) {
        return v;
      }
    }

    // {undefined}
    if (expr.type === AST_NODE_TYPES.Identifier && expr.name === "undefined") {
      return undefined;
    }

    // Negative numbers: {-42}
    if (
      expr.type === AST_NODE_TYPES.UnaryExpression &&
      expr.operator === "-" &&
      expr.argument.type === AST_NODE_TYPES.Literal &&
      typeof expr.argument.value === "number"
    ) {
      return -expr.argument.value;
    }
  }

  return SKIP;
};

export default createEslintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: "suggestion",
    docs: {
      description:
        "disallow passing a JSX prop whose value matches the component's destructuring default for that prop",
      url: "https://github.com/AndreaPontrandolfo/eslint-plugin-fsecond/blob/master/docs/rules/no-redundant-jsx-prop-usage.md",
      recommended: false,
      requiresTypeChecking: true,
    },
    fixable: "code",
    schema: [],
    messages: {
      noRedundantJsxPropUsage:
        'Prop "{{propName}}" is redundant — it matches the default value ({{defaultValue}}).',
    },
  },
  defaultOptions: [],
  create(context) {
    const services = ESLintUtils.getParserServices(context);
    const checker = services.program.getTypeChecker();

    // Cache defaults per resolved symbol to avoid redundant work within a file
    const defaultsCache = new Map<
      ts.Symbol,
      Map<string, PrimitiveValue> | null
    >();

    const getDefaultsForSymbol = (
      symbol: ts.Symbol,
    ): Map<string, PrimitiveValue> | null => {
      if (defaultsCache.has(symbol)) {
        return defaultsCache.get(symbol) ?? null;
      }

      const { declarations } = symbol;

      if (!declarations || declarations.length === 0) {
        defaultsCache.set(symbol, null);

        return null;
      }

      for (const declaration of declarations) {
        const defaults = extractDefaultsFromDeclaration(declaration);

        if (defaults !== null) {
          defaultsCache.set(symbol, defaults);

          return defaults;
        }
      }

      defaultsCache.set(symbol, null);

      return null;
    };

    return {
      JSXOpeningElement(node) {
        // Skip intrinsic HTML elements (lowercase names like "div", "span")
        const nameNode = node.name;

        // Skip intrinsic HTML elements: lowercase or empty names
        if (
          nameNode.type === AST_NODE_TYPES.JSXIdentifier &&
          (nameNode.name.length === 0 ||
            nameNode.name.startsWith(nameNode.name[0].toLowerCase()))
        ) {
          return;
        }

        // Resolve the component symbol via type checker
        const symbol = services.getSymbolAtLocation(nameNode);

        if (!symbol) {
          return;
        }

        // Follow import aliases to reach the original declaration
        const resolvedSymbol =
          symbol.flags & ts.SymbolFlags.Alias
            ? checker.getAliasedSymbol(symbol)
            : symbol;

        const defaults = getDefaultsForSymbol(resolvedSymbol);

        if (!defaults || defaults.size === 0) {
          return;
        }

        // Check each JSX attribute against the defaults
        for (const attr of node.attributes) {
          if (attr.type !== AST_NODE_TYPES.JSXAttribute) {
            continue;
          }

          const propNameNode = attr.name;

          if (propNameNode.type !== AST_NODE_TYPES.JSXIdentifier) {
            continue;
          }
          const propName = propNameNode.name;

          if (!defaults.has(propName)) {
            continue;
          }

          const attrValue = getJSXAttributePrimitiveValue(attr);

          if (attrValue === SKIP) {
            continue;
          }

          const defaultValue = defaults.get(propName);

          if (attrValue === defaultValue) {
            context.report({
              node: attr,
              messageId: "noRedundantJsxPropUsage",
              data: {
                propName,
                defaultValue: String(defaultValue),
              },
              fix(fixer) {
                const tokenBefore = context.sourceCode.getTokenBefore(attr);

                // Remove the attribute along with the preceding whitespace/token gap
                const start = tokenBefore ? tokenBefore.range[1] : attr.range[0];

                return fixer.removeRange([start, attr.range[1]]);
              },
            });
          }
        }
      },
    };
  },
});

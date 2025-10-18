/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";
import { createEslintRule } from "../utils";

export const RULE_NAME = "valid-event-listener";
export type MessageIds =
  | "required-cleanup"
  | "required-remove-eventListener"
  | "no-conditional-addeventlistener"
  | "require-use-event-listener-hook";
export type Options = unknown[];

/**
 * Helper function: Check if a node is a method call to addEventListener or removeEventListener.
 */
const isEventListenerMethodCall = (
  node: unknown,
  methodName: "addEventListener" | "removeEventListener",
): node is TSESTree.CallExpression => {
  return (
    node instanceof Object &&
    "type" in node &&
    node.type === AST_NODE_TYPES.CallExpression &&
    "callee" in node &&
    node.callee instanceof Object &&
    "type" in node.callee &&
    node.callee.type === AST_NODE_TYPES.MemberExpression &&
    "property" in node.callee &&
    node.callee.property instanceof Object &&
    "type" in node.callee.property &&
    node.callee.property.type === AST_NODE_TYPES.Identifier &&
    "name" in node.callee.property &&
    node.callee.property.name === methodName
  );
};

/**
 * Helper function: Check if node is an addEventListener call.
 */
const isAddEventListenerCall = (node: unknown): boolean => {
  return isEventListenerMethodCall(node, "addEventListener");
};

/**
 * Helper function: Check if node is a removeEventListener call.
 */
const isRemoveEventListenerCall = (node: unknown): boolean => {
  return isEventListenerMethodCall(node, "removeEventListener");
};

/**
 * Helper function: Check if an expression statement contains a conditional addEventListener.
 */
const isConditionalAddEventListener = (node: TSESTree.Statement): boolean => {
  if (node.type !== AST_NODE_TYPES.IfStatement) {
    return false;
  }

  // Check if statement has addEventListener in consequent block
  if (node.consequent.type === AST_NODE_TYPES.BlockStatement) {
    for (const statement of node.consequent.body) {
      if (
        statement.type === AST_NODE_TYPES.ExpressionStatement &&
        isAddEventListenerCall(statement.expression)
      ) {
        return true;
      }
    }
  }

  // Check inline if without block
  if (
    node.consequent.type === AST_NODE_TYPES.ExpressionStatement &&
    isAddEventListenerCall(node.consequent.expression)
  ) {
    return true;
  }

  // Check else/alternate block
  if (node.alternate?.type === AST_NODE_TYPES.BlockStatement) {
    for (const statement of node.alternate.body) {
      if (
        statement.type === AST_NODE_TYPES.ExpressionStatement &&
        isAddEventListenerCall(statement.expression)
      ) {
        return true;
      }
    }
  }

  // Check inline else
  return (
    node.alternate?.type === AST_NODE_TYPES.ExpressionStatement &&
    isAddEventListenerCall(node.alternate.expression)
  );
};

/**
 * Helper function: Check if expression has conditional addEventListener (logical or ternary).
 */
const isConditionalExpression = (expression: TSESTree.Expression): boolean => {
  // Check logical AND: x && element.addEventListener(...)
  if (
    expression.type === AST_NODE_TYPES.LogicalExpression &&
    expression.operator === "&&" &&
    isAddEventListenerCall(expression.right)
  ) {
    return true;
  }

  // Check ternary: x ? element.addEventListener(...) : ...
  if (expression.type === AST_NODE_TYPES.ConditionalExpression) {
    if (isAddEventListenerCall(expression.consequent)) {
      return true;
    }
    if (isAddEventListenerCall(expression.alternate)) {
      return true;
    }
  }

  return false;
};

/**
 * Helper function: Search block for addEventListener, return true if found.
 */
const findAddEventListenerInBlock = (
  statements: TSESTree.Statement[],
): boolean => {
  for (const statement of statements) {
    if (statement.type === AST_NODE_TYPES.ExpressionStatement) {
      if (isAddEventListenerCall(statement.expression)) {
        return true;
      }
      if (isConditionalExpression(statement.expression)) {
        return true;
      }
    }
  }

  return false;
};

/**
 * Helper function: Search block for removeEventListener, return true if found.
 */
const findRemoveEventListenerInBlock = (
  statements: TSESTree.Statement[],
): boolean => {
  for (const statement of statements) {
    if (
      statement.type === AST_NODE_TYPES.ExpressionStatement &&
      isRemoveEventListenerCall(statement.expression)
    ) {
      return true;
    }
  }

  return false;
};

/**
 * Helper function: Search cleanup function (return statement) for removeEventListener.
 */
const findRemoveEventListenerInCleanup = (
  statements: TSESTree.Statement[],
): boolean => {
  for (const statement of statements) {
    if (statement.type !== AST_NODE_TYPES.ReturnStatement) {
      continue;
    }

    const cleanupFunction = statement.argument;

    if (
      cleanupFunction?.type === AST_NODE_TYPES.ArrowFunctionExpression &&
      cleanupFunction.body?.type === AST_NODE_TYPES.BlockStatement &&
      cleanupFunction.body.body &&
      findRemoveEventListenerInBlock(cleanupFunction.body.body)
    ) {
      return true;
    }
  }

  return false;
};

/**
 * Helper function: Check if there's a return statement with a cleanup function.
 */
const hasReturnStatement = (statements: TSESTree.Statement[]): boolean => {
  for (const statement of statements) {
    if (
      statement.type === AST_NODE_TYPES.ReturnStatement &&
      statement.argument?.type === AST_NODE_TYPES.ArrowFunctionExpression
    ) {
      return true;
    }
  }

  return false;
};

/**
 * Helper function: Check if useEffect body has conditional addEventListener.
 */
const hasConditionalAddEventListener = (
  statements: TSESTree.Statement[],
): boolean => {
  for (const statement of statements) {
    if (isConditionalAddEventListener(statement)) {
      return true;
    }

    if (
      statement.type === AST_NODE_TYPES.ExpressionStatement &&
      isConditionalExpression(statement.expression)
    ) {
      return true;
    }
  }

  return false;
};

export default createEslintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: "problem",
    docs: {
      description: "enforces best practices around addEventListener method.",
      url: "https://github.com/AndreaPontrandolfo/eslint-plugin-fsecond/blob/master/docs/rules/valid-event-listener.md",
      recommended: true,
    },
    schema: [
      {
        type: "object",
        additionalProperties: false,
        properties: {
          requireUseEventListenerHook: {
            description: "Require the use of a useEventListener hook",
            type: "boolean",
          },
        },
      },
    ],
    defaultOptions: [
      {
        requireUseEventListenerHook: true,
      },
    ],
    messages: {
      "required-cleanup":
        "Missing a cleanup function for the addEventListener.",
      "required-remove-eventListener":
        "Missing a matching removeEventListener.",
      "no-conditional-addeventlistener":
        "Don't wrap a addEventListener in a condition.",
      "require-use-event-listener-hook":
        "Use a useEventListener hook from a hooks library instead of manually adding and removing event listeners.",
    },
  },
  defaultOptions: [
    {
      requireUseEventListenerHook: true,
    },
  ],
  create(context) {
    const providedFirstOption = context.options[0] ?? {};
    const { requireUseEventListenerHook } = {
      requireUseEventListenerHook: true,
      ...providedFirstOption,
    };

    return {
      ExpressionStatement(node) {
        const expression = node?.expression;

        if (expression.type !== AST_NODE_TYPES.CallExpression) {
          return;
        }

        const calleeName =
          expression?.callee &&
          expression.callee.type === AST_NODE_TYPES.Identifier &&
          expression.callee.name;

        if (calleeName !== "useEffect") {
          return;
        }

        const useEffectBodyInternalItems =
          expression?.arguments &&
          expression.arguments.length > 0 &&
          expression.arguments[0].type ===
            AST_NODE_TYPES.ArrowFunctionExpression &&
          expression.arguments[0].body &&
          expression.arguments[0].body.type === AST_NODE_TYPES.BlockStatement &&
          expression.arguments[0].body.body;

        if (
          !useEffectBodyInternalItems ||
          useEffectBodyInternalItems.length === 0
        ) {
          return;
        }

        // Check for conditional addEventListener first
        const hasConditionalAdd = hasConditionalAddEventListener(
          useEffectBodyInternalItems,
        );

        if (hasConditionalAdd) {
          context.report({
            node,
            messageId: "no-conditional-addeventlistener",
          });

          return;
        }

        // Check for addEventListener in the main body
        const hasAddEventListener = findAddEventListenerInBlock(
          useEffectBodyInternalItems,
        );

        if (!hasAddEventListener) {
          return;
        }

        // Check if hook is required
        if (requireUseEventListenerHook) {
          context.report({
            node,
            messageId: "require-use-event-listener-hook",
          });

          return;
        }

        // Check for cleanup
        const hasReturnStmt = hasReturnStatement(useEffectBodyInternalItems);
        const hasRemoveEventListener = findRemoveEventListenerInCleanup(
          useEffectBodyInternalItems,
        );

        if (!hasRemoveEventListener) {
          if (hasReturnStmt) {
            context.report({
              node,
              messageId: "required-remove-eventListener",
            });
          } else {
            context.report({
              node,
              messageId: "required-cleanup",
            });
          }
        }
      },
    };
  },
});

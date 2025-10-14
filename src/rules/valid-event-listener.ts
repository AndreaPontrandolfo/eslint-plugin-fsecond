/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import { createEslintRule } from "../utils";

export const RULE_NAME = "valid-event-listener";
export type MessageIds =
  | "required-cleanup"
  | "required-remove-eventListener"
  | "no-conditional-addeventlistener"
  | "require-use-event-listener-hook";
export type Options = unknown[];

export default createEslintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: "problem",
    docs: {
      description: "Enforces best practices around addEventListener method.",
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
    const providedFirstOption = context.options[0];
    const { requireUseEventListenerHook } = {
      requireUseEventListenerHook: true,
      ...providedFirstOption,
    };

    return {
      ExpressionStatement(node) {
        let hasAddEventListener = false;
        let hasReturnStatement = false;
        let hasRemoveEventListener = false;
        let hasAddEventListenerInCondition = false;
        const expression = node?.expression;

        if (expression.type !== AST_NODE_TYPES.CallExpression) {
          return;
        }
        const calleeName =
          expression?.callee &&
          expression.callee.type === AST_NODE_TYPES.Identifier &&
          expression.callee.name;

        if (calleeName === "useEffect") {
          const useEffectBodyInternalItems =
            expression?.arguments &&
            expression.arguments.length > 0 &&
            expression.arguments[0].type ===
              AST_NODE_TYPES.ArrowFunctionExpression &&
            expression.arguments[0].body &&
            expression.arguments[0].body.type ===
              AST_NODE_TYPES.BlockStatement &&
            expression.arguments[0].body.body;

          if (
            useEffectBodyInternalItems &&
            useEffectBodyInternalItems.length > 0
          ) {
            useEffectBodyInternalItems.every((element) => {
              const elementType = element.type;

              if (elementType === AST_NODE_TYPES.IfStatement) {
                if (element.consequent.type === AST_NODE_TYPES.BlockStatement) {
                  element.consequent.body.forEach((ifStatementBodyElement) => {
                    const ifStatementExpression =
                      ifStatementBodyElement.type ===
                        AST_NODE_TYPES.ExpressionStatement &&
                      ifStatementBodyElement.expression;
                    const ifStatementExpressionCalle =
                      ifStatementExpression.type === "CallExpression" &&
                      ifStatementExpression.callee;

                    if (
                      ifStatementExpressionCalle.type === "MemberExpression" &&
                      ifStatementExpressionCalle.property.type ===
                        "Identifier" &&
                      ifStatementExpressionCalle.property.name ===
                        "addEventListener"
                    ) {
                      hasAddEventListenerInCondition = true;
                    }
                  });
                }
                if (element.alternate?.type === AST_NODE_TYPES.BlockStatement) {
                  element.alternate.body.forEach(
                    (ifStatementAlternateBodyElement) => {
                      const ifStatementAlternateExpression =
                        ifStatementAlternateBodyElement.type ===
                          AST_NODE_TYPES.ExpressionStatement &&
                        ifStatementAlternateBodyElement.expression;
                      const ifStatementAlternateExpressionCalle =
                        ifStatementAlternateExpression.type ===
                          "CallExpression" &&
                        ifStatementAlternateExpression.callee;

                      if (
                        ifStatementAlternateExpressionCalle.type ===
                          "MemberExpression" &&
                        ifStatementAlternateExpressionCalle.property.type ===
                          "Identifier" &&
                        ifStatementAlternateExpressionCalle.property.name ===
                          "addEventListener"
                      ) {
                        hasAddEventListenerInCondition = true;
                      }
                    },
                  );
                }
                if (
                  element.consequent.type === AST_NODE_TYPES.ExpressionStatement
                ) {
                  const ifStatementExpression = element.consequent.expression;

                  if (
                    ifStatementExpression.type ===
                      AST_NODE_TYPES.CallExpression &&
                    ifStatementExpression.callee.type ===
                      AST_NODE_TYPES.MemberExpression &&
                    ifStatementExpression.callee.property.type ===
                      AST_NODE_TYPES.Identifier &&
                    ifStatementExpression.callee.property.name ===
                      "addEventListener"
                  ) {
                    hasAddEventListenerInCondition = true;

                    return true;
                  }
                }
              }
              if (hasRemoveEventListener) {
                return false;
              }
              if (elementType === AST_NODE_TYPES.ExpressionStatement) {
                const internalExpression = element.expression;

                if (
                  internalExpression.type ===
                    AST_NODE_TYPES.LogicalExpression &&
                  internalExpression.operator === "&&" &&
                  internalExpression.right.type ===
                    AST_NODE_TYPES.CallExpression &&
                  internalExpression.right.callee.type ===
                    AST_NODE_TYPES.MemberExpression &&
                  internalExpression.right.callee.property.type ===
                    AST_NODE_TYPES.Identifier &&
                  internalExpression.right.callee.property.name ===
                    "addEventListener"
                ) {
                  hasAddEventListenerInCondition = true;

                  return true;
                }
                if (
                  (internalExpression.type ===
                    AST_NODE_TYPES.ConditionalExpression &&
                    internalExpression.consequent.type ===
                      AST_NODE_TYPES.CallExpression &&
                    internalExpression.consequent.callee.type ===
                      AST_NODE_TYPES.MemberExpression &&
                    internalExpression.consequent.callee.property.type ===
                      AST_NODE_TYPES.Identifier &&
                    internalExpression.consequent.callee.property.name ===
                      "addEventListener") ||
                  (internalExpression.type ===
                    AST_NODE_TYPES.ConditionalExpression &&
                    internalExpression.alternate.type ===
                      AST_NODE_TYPES.CallExpression &&
                    internalExpression.alternate.callee.type ===
                      AST_NODE_TYPES.MemberExpression &&
                    internalExpression.alternate.callee.property.type ===
                      AST_NODE_TYPES.Identifier &&
                    internalExpression.alternate.callee.property.name ===
                      "addEventListener")
                ) {
                  hasAddEventListenerInCondition = true;

                  return true;
                }
                if (internalExpression.type !== AST_NODE_TYPES.CallExpression) {
                  return true;
                }
                const internalExpressionCallee = internalExpression.callee;

                if (
                  internalExpressionCallee.type !==
                  AST_NODE_TYPES.MemberExpression
                ) {
                  return true;
                }
                const internalExpressionCalleeProperty =
                  internalExpressionCallee.property;

                if (
                  internalExpressionCalleeProperty.type !==
                  AST_NODE_TYPES.Identifier
                ) {
                  return true;
                }
                const internalExpressionCalleePropertyName =
                  internalExpressionCalleeProperty.name;

                if (
                  internalExpressionCalleePropertyName === "addEventListener"
                ) {
                  hasAddEventListener = true;

                  return true;
                }
              }
              if (
                hasAddEventListener &&
                elementType === AST_NODE_TYPES.ReturnStatement
              ) {
                hasReturnStatement = true;
                const returnBlockBody =
                  element.argument &&
                  element.argument.type ===
                    AST_NODE_TYPES.ArrowFunctionExpression &&
                  element.argument.body &&
                  element.argument.body.type ===
                    AST_NODE_TYPES.BlockStatement &&
                  element.argument.body.body;

                if (returnBlockBody && returnBlockBody.length > 0) {
                  returnBlockBody.every((returnElement) => {
                    if (hasRemoveEventListener) {
                      return false;
                    }
                    const returnElementCallee =
                      returnElement.type ===
                        AST_NODE_TYPES.ExpressionStatement &&
                      returnElement.expression &&
                      returnElement.expression.type ===
                        AST_NODE_TYPES.CallExpression &&
                      returnElement.expression.callee;
                    const returnElementCalleeProperty =
                      returnElementCallee &&
                      returnElementCallee.type ===
                        AST_NODE_TYPES.MemberExpression &&
                      returnElementCallee.property &&
                      returnElementCallee.property.type ===
                        AST_NODE_TYPES.Identifier &&
                      returnElementCallee.property.name;

                    if (returnElementCalleeProperty === "removeEventListener") {
                      hasRemoveEventListener = true;
                    }

                    return true;
                  });
                }
              }

              return true;
            });
          }
          if (hasAddEventListener && requireUseEventListenerHook) {
            context.report({
              node,
              messageId: "require-use-event-listener-hook",
            });
          }
          if (hasAddEventListenerInCondition) {
            context.report({
              node,
              messageId: "no-conditional-addeventlistener",
            });
          } else {
            if (hasAddEventListener && !hasRemoveEventListener) {
              if (hasReturnStatement) {
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
          }
        }
      },
    };
  },
});

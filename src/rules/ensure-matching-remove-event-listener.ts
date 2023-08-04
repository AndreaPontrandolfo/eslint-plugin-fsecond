import { createEslintRule } from "../utils";

export const RULE_NAME = "ensure-matching-remove-event-listener";
export type MessageIds =
  | "required-cleanup"
  | "required-remove-eventListener"
  | "no-conditional-addeventlistener";
export type Options = [];

export default createEslintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: "problem",
    docs: {
      description:
        "Enforces that every addEventListener should have a matching removeEventListener in the same useEffect block",
      recommended: "recommended",
    },
    schema: [],
    messages: {
      "required-cleanup":
        "Missing a cleanup function for the addEventListener.",
      "required-remove-eventListener":
        "Missing a matching removeEventListener.",
      "no-conditional-addeventlistener":
        "Don't wrap a addEventListener in a condition.",
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      ExpressionStatement(node) {
        let hasAddEventListener = null;
        let hasReturnStatement = null;
        let hasRemoveEventListener = null;
        let hasAddEventListenerInCondition = null;
        const expression = node && node.expression;
        if (expression?.type !== "CallExpression") {
          return;
        }
        const calleeName =
          expression &&
          expression.callee &&
          expression.callee.type === "Identifier" &&
          expression.callee.name;
        if (calleeName === "useEffect") {
          const useEffectBodyInternalItems =
            expression &&
            expression.arguments &&
            expression.arguments.length > 0 &&
            expression.arguments[0].type === "ArrowFunctionExpression" &&
            expression.arguments[0].body &&
            expression.arguments[0].body.type === "BlockStatement" &&
            expression.arguments[0].body.body;
          if (
            useEffectBodyInternalItems &&
            useEffectBodyInternalItems.length > 0
          ) {
            useEffectBodyInternalItems.every((element) => {
              const elementType = element.type;
              if (elementType === "IfStatement") {
                element.consequent.type === "BlockStatement" &&
                  element.consequent.body.forEach((ifStatementBodyElement) => {
                    const ifStatementExpression =
                      ifStatementBodyElement.type === "ExpressionStatement" &&
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
                    return hasAddEventListenerInCondition;
                  });
              }
              if (hasRemoveEventListener) {
                return false;
              }
              if (elementType === "ExpressionStatement") {
                const internalExpression = element.expression;
                if (
                  internalExpression.type === "LogicalExpression" &&
                  internalExpression.operator === "&&" &&
                  internalExpression.right.type === "CallExpression" &&
                  internalExpression.right.callee.type === "MemberExpression" &&
                  internalExpression.right.callee.property.type ===
                    "Identifier" &&
                  internalExpression.right.callee.property.name ===
                    "addEventListener"
                ) {
                  hasAddEventListenerInCondition = true;
                }
                if (internalExpression.type !== "CallExpression") {
                  return true;
                }
                const internalExpressionCallee = internalExpression?.callee;
                if (internalExpressionCallee.type !== "MemberExpression") {
                  return true;
                }
                const internalExpressionCalleeProperty =
                  internalExpressionCallee?.property;
                if (internalExpressionCalleeProperty.type !== "Identifier") {
                  return true;
                }
                const internalExpressionCalleePropertyName =
                  internalExpressionCalleeProperty?.name;
                if (
                  internalExpressionCalleePropertyName === "addEventListener"
                ) {
                  hasAddEventListener = true;
                  return true;
                }
              }
              if (hasAddEventListener) {
                if (elementType === "ReturnStatement") {
                  hasReturnStatement = true;
                  const returnBlockBody =
                    element.argument &&
                    element.argument.type === "ArrowFunctionExpression" &&
                    element.argument.body &&
                    element.argument.body.type === "BlockStatement" &&
                    element.argument.body.body;
                  if (returnBlockBody && returnBlockBody.length > 0) {
                    returnBlockBody.every((returnElement) => {
                      if (hasRemoveEventListener) {
                        return false;
                      }
                      const returnElementCallee =
                        returnElement.type === "ExpressionStatement" &&
                        returnElement.expression &&
                        returnElement.expression.type === "CallExpression" &&
                        returnElement.expression.callee;
                      const returnElementCalleeProperty =
                        returnElementCallee &&
                        returnElementCallee.type === "MemberExpression" &&
                        returnElementCallee.property &&
                        returnElementCallee.property.type === "Identifier" &&
                        returnElementCallee.property.name;
                      if (
                        returnElementCalleeProperty === "removeEventListener"
                      ) {
                        hasRemoveEventListener = true;
                      }
                      return true;
                    });
                  }
                }
              }
              return true;
            });
          }
          if (hasAddEventListenerInCondition) {
            context.report({
              node,
              messageId: "no-conditional-addeventlistener",
            });
          } else {
            if (hasAddEventListener) {
              if (!hasRemoveEventListener) {
                if (!hasReturnStatement) {
                  context.report({
                    node,
                    messageId: "required-cleanup",
                  });
                } else {
                  context.report({
                    node,
                    messageId: "required-remove-eventListener",
                  });
                }
              }
            }
          }
        }
      },
    };
  },
});

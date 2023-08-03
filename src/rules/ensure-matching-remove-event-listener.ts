import { createEslintRule } from "../utils";

export const RULE_NAME = "ensure-matching-remove-event-listener";
export type MessageIds = "required-cleanup" | "required-remove-eventListener";
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
    },
  },
  defaultOptions: [],
  create: function (context) {
    return {
      ExpressionStatement(node) {
        let hasAddEventListener = null;
        let hasReturnStatement = null;
        let hasRemoveEventListener = null;
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
              if (hasRemoveEventListener) {
                return false;
              }
              const elementType = element.type;
              if (elementType === "ExpressionStatement") {
                const internalExpression = element.expression;
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
      },
    };
  },
});

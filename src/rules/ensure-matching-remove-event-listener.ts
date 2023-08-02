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
          const internalExpressions =
            expression &&
            expression.arguments &&
            expression.arguments.length > 0 &&
            expression.arguments[0].type === "ArrowFunctionExpression" &&
            expression.arguments[0].body &&
            expression.arguments[0].body.body;
          if (internalExpressions && internalExpressions.length > 0) {
            internalExpressions.every((element) => {
              if (hasRemoveEventListener) {
                return false;
              }
              const elementType = element.type;
              const internalExpression = element.expression;
              const internalExpressionCallee =
                internalExpression && internalExpression.callee;
              const internalExpressionCalleeProperty =
                internalExpressionCallee &&
                internalExpressionCallee.property &&
                internalExpressionCallee.property.name;
              if (internalExpressionCalleeProperty === "addEventListener") {
                hasAddEventListener = true;
                return true;
              }
              if (hasAddEventListener) {
                if (elementType === "ReturnStatement") {
                  hasReturnStatement = true;
                  const returnBlockBody =
                    element.argument &&
                    element.argument.body &&
                    element.argument.body.body;
                  if (returnBlockBody && returnBlockBody.length > 0) {
                    returnBlockBody.every((returnElement) => {
                      if (hasRemoveEventListener) {
                        return false;
                      }
                      const returnElementCallee =
                        returnElement.expression &&
                        returnElement.expression.callee;
                      const returnElementCalleeObject =
                        returnElementCallee &&
                        returnElementCallee.object &&
                        returnElementCallee.object.name;
                      const returnElementCalleeProperty =
                        returnElementCallee &&
                        returnElementCallee.property &&
                        returnElementCallee.property.name;
                      if (
                        returnElementCalleeObject === "window" &&
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

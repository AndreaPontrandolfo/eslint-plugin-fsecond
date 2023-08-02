import { createEslintRule } from "../utils";

export const RULE_NAME = "prefer-destructured-optionals";
export type MessageIds = "noNonDestructuredOptional";
export type Options = [];

export default createEslintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: "problem",
    docs: {
      description:
        "Enforces placing optional parameters on a destructured object instead of the function signature itself",
      recommended: "stylistic",
    },
    schema: [],
    messages: {
      noNonDestructuredOptional:
        "Move this optional parameter to a destructured parameter.",
    },
  },
  defaultOptions: [],
  create: function (context) {
    function checkParameters(params) {
      params.forEach((param) => {
        if (param.optional || param.type === "AssignmentPattern") {
          context.report({
            node: param,
            messageId: "noNonDestructuredOptional",
          });
        }
      });
    }

    return {
      FunctionDeclaration(node) {
        checkParameters(node.params);
      },
      FunctionExpression(node) {
        checkParameters(node.params);
      },
      ArrowFunctionExpression(node) {
        checkParameters(node.params);
      },
    };
  },
});

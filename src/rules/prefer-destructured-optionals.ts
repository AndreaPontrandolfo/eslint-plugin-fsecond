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
        "Enforce placing optional parameters on a destructured object instead of the function signature itself",
    },
    schema: [],
    messages: {
      noNonDestructuredOptional:
        "Move this optional parameter to a destructured parameter.",
    },
  },
  defaultOptions: [],
  create(context) {
    function checkParameters(params) {
      let isParamObjectInTheMiddle = false;

      params.forEach((param) => {
        if (param.type === "ObjectPattern") {
          isParamObjectInTheMiddle = true;
        }

        if (
          param.left?.type !== "ObjectPattern" &&
          (param.optional || param.type === "AssignmentPattern")
        ) {
          context.report({
            node: param,
            messageId: "noNonDestructuredOptional",
          });
        }

        if (isParamObjectInTheMiddle && param.type !== "ObjectPattern") {
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

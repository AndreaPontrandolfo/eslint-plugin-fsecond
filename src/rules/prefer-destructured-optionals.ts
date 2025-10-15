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
        "enforce placing optional parameters on a destructured object instead of the function signature itself",
      recommended: true,
      url: "https://github.com/AndreaPontrandolfo/eslint-plugin-fsecond/blob/master/docs/rules/prefer-destructured-optionals.md",
    },
    schema: [],
    messages: {
      noNonDestructuredOptional:
        "Convert this optional parameter to a destructured parameter.",
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

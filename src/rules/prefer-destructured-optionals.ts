import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";
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
    const checkParameters = (params: TSESTree.Parameter[]) => {
      let isParamObjectInTheMiddle = false;

      params.forEach((param) => {
        if (param.type === AST_NODE_TYPES.ObjectPattern) {
          isParamObjectInTheMiddle = true;
        }

        if (
          (param.type === AST_NODE_TYPES.AssignmentPattern &&
            param.left.type !== AST_NODE_TYPES.ObjectPattern) ||
          (param.type === AST_NODE_TYPES.Identifier && param.optional)
        ) {
          context.report({
            node: param,
            messageId: "noNonDestructuredOptional",
          });
        }

        if (
          isParamObjectInTheMiddle &&
          param.type !== AST_NODE_TYPES.ObjectPattern
        ) {
          context.report({
            node: param,
            messageId: "noNonDestructuredOptional",
          });
        }
      });
    };

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

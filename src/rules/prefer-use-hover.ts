import { Rule } from "eslint";

const rule: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Prefer using the `useHover` hook instead of `onMouseEnter` and `onMouseLeave`",
      category: "Best Practices",
      recommended: true,
    },
    fixable: "code",
    schema: [],
  },

  create: function (context) {
    return {
      JSXOpeningElement(node) {
        const { name, attributes } = node;

        if (name.name === "div") {
          const onMouseEnterAttribute = attributes.find(
            (attr) => attr.name.name === "onMouseEnter",
          );
          const onMouseLeaveAttribute = attributes.find(
            (attr) => attr.name.name === "onMouseLeave",
          );

          if (onMouseEnterAttribute && onMouseLeaveAttribute) {
            context.report({
              node,
              message:
                "Prefer using the `useHover` hook instead of `onMouseEnter` and `onMouseLeave`",
              fix: (fixer) => {
                const sourceCode = context.getSourceCode();
                const onMouseEnterRange = sourceCode.getRange(
                  onMouseEnterAttribute,
                );
                const onMouseLeaveRange = sourceCode.getRange(
                  onMouseLeaveAttribute,
                );

                const replacement = `useHover({ onMouseEnter: ${onMouseEnterAttribute.value.value}, onMouseLeave: ${onMouseLeaveAttribute.value.value} })`;

                return fixer.replaceTextRange(
                  [onMouseEnterRange[0], onMouseLeaveRange[1]],
                  replacement,
                );
              },
            });
          }
        }
      },
    };
  },
};

export default rule;

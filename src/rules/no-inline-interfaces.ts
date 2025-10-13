import type { TSESTree } from "@typescript-eslint/utils";
import { createEslintRule } from "../utils";

export const RULE_NAME = "no-inline-interfaces";
export type MessageIds = "noInlineInterfaces";
export type Options = [
  {
    checkGenericTypes?: boolean;
    checkReturnTypes?: boolean;
  }?,
];

/**
 * Recursively find all TSTypeLiteral nodes in a type annotation.
 * Returns all inline object type literals that should be reported.
 */
function findTypeLiterals(
  type: TSESTree.TypeNode | undefined,
  results: TSESTree.TSTypeLiteral[] = [],
  checkGenericTypes = false,
): TSESTree.TSTypeLiteral[] {
  if (!type) {
    return results;
  }

  switch (type.type) {
    case "TSTypeLiteral": {
      results.push(type);
      // Also check for nested type literals inside the members
      type.members.forEach((member) => {
        if (member.type === "TSPropertySignature" && member.typeAnnotation) {
          findTypeLiterals(
            member.typeAnnotation.typeAnnotation,
            results,
            checkGenericTypes,
          );
        }
      });

      return results;
    }

    case "TSUnionType":
    case "TSIntersectionType": {
      for (const t of type.types) {
        findTypeLiterals(t, results, checkGenericTypes);
      }
      break;
    }

    case "TSTypeReference": {
      // Only check generic type arguments if checkGenericTypes is true
      if (checkGenericTypes && type.typeArguments) {
        type.typeArguments.params.forEach((param) => {
          findTypeLiterals(param, results, checkGenericTypes);
        });
      }
      break;
    }

    case "TSArrayType": {
      findTypeLiterals(type.elementType, results, checkGenericTypes);
      break;
    }

    case "TSTupleType": {
      type.elementTypes.forEach((elementType) => {
        findTypeLiterals(elementType, results, checkGenericTypes);
      });
      break;
    }

    case "TSOptionalType": {
      findTypeLiterals(type.typeAnnotation, results, checkGenericTypes);
      break;
    }

    case "TSRestType": {
      findTypeLiterals(type.typeAnnotation, results, checkGenericTypes);
      break;
    }

    case "TSTypeOperator": {
      findTypeLiterals(type.typeAnnotation, results, checkGenericTypes);
      break;
    }

    case "TSIndexedAccessType": {
      findTypeLiterals(type.objectType, results, checkGenericTypes);
      findTypeLiterals(type.indexType, results, checkGenericTypes);
      break;
    }

    // Add other type node cases as needed
    default: {
      // Ignore other type nodes (primitives, etc.)
      break;
    }
  }

  return results;
}

export default createEslintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Disallow inline object type literals in variable and function annotations; extract to a named interface or type alias.",
    },
    schema: [
      {
        type: "object",
        properties: {
          checkGenericTypes: {
            type: "boolean",
            description:
              "Check inline object types within generic type arguments (e.g., Array<{ a: string }>)",
            default: false,
          },
          checkReturnTypes: {
            type: "boolean",
            description:
              "Check inline object types in function return type annotations",
            default: false,
          },
        },
        additionalProperties: false,
      },
    ],
    defaultOptions: [],
    messages: {
      noInlineInterfaces:
        "Extract this inline object type into a named interface or type alias and reference it here.",
    },
  },
  defaultOptions: [
    {
      checkGenericTypes: false,
      checkReturnTypes: false,
    },
  ],
  create(context) {
    const options = context.options[0] || {};
    const checkGenericTypes = options.checkGenericTypes ?? false;
    const checkReturnTypes = options.checkReturnTypes ?? false;

    /**
     * Check if a node is inside a class.
     */
    function isInsideClass(node: TSESTree.Node): boolean {
      let current = node.parent;

      while (current) {
        if (
          current.type === "ClassDeclaration" ||
          current.type === "ClassExpression"
        ) {
          return true;
        }
        current = current.parent;
      }

      return false;
    }

    /**
     * Report all inline object type literals found in a type annotation.
     */
    function reportTypeAnnotation(
      typeAnnotation: TSESTree.TypeNode | undefined,
    ) {
      const literals = findTypeLiterals(typeAnnotation, [], checkGenericTypes);

      for (const literal of literals) {
        context.report({ node: literal, messageId: "noInlineInterfaces" });
      }
    }

    /**
     * Check a parameter node for type annotations
     * Handles both direct parameters and parameters with default values (AssignmentPattern).
     */
    function checkParameter(param: TSESTree.Parameter) {
      let nodeToCheck: TSESTree.Node = param;

      // If parameter has a default value, it's wrapped in AssignmentPattern
      // The type annotation is on the 'left' side
      if (param.type === "AssignmentPattern") {
        nodeToCheck = param.left;
      }

      const p = nodeToCheck as TSESTree.Node & {
        typeAnnotation?: TSESTree.TSTypeAnnotation;
      };

      if (p.typeAnnotation) {
        reportTypeAnnotation(p.typeAnnotation.typeAnnotation);
      }
    }

    return {
      VariableDeclarator(node) {
        // Skip if inside a class
        if (isInsideClass(node)) {
          return;
        }

        // Check variable type annotation
        const id = node.id as TSESTree.Node & {
          typeAnnotation?: TSESTree.TSTypeAnnotation;
        };

        if (id.typeAnnotation) {
          reportTypeAnnotation(id.typeAnnotation.typeAnnotation);
        }
      },

      FunctionDeclaration(node) {
        // Skip if inside a class
        if (isInsideClass(node)) {
          return;
        }

        // Check each parameter's type annotation
        node.params.forEach((param) => {
          checkParameter(param);
        });

        // Check return type annotation if enabled
        if (checkReturnTypes && node.returnType) {
          reportTypeAnnotation(node.returnType.typeAnnotation);
        }
      },

      FunctionExpression(node) {
        // Skip if inside a class
        if (isInsideClass(node)) {
          return;
        }

        // Check each parameter's type annotation
        node.params.forEach((param) => {
          checkParameter(param);
        });

        // Check return type annotation if enabled
        if (checkReturnTypes && node.returnType) {
          reportTypeAnnotation(node.returnType.typeAnnotation);
        }
      },

      ArrowFunctionExpression(node) {
        // Skip if inside a class
        if (isInsideClass(node)) {
          return;
        }

        // Check each parameter's type annotation
        node.params.forEach((param) => {
          checkParameter(param);
        });

        // Check return type annotation if enabled
        if (checkReturnTypes && node.returnType) {
          reportTypeAnnotation(node.returnType.typeAnnotation);
        }
      },
    };
  },
});

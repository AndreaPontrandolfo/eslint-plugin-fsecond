import { TSESTree } from "@typescript-eslint/utils";
import { createEslintRule } from "../utils";

export const RULE_NAME = "no-inline-interfaces";
export type MessageIds = "noInlineInterfaces";
export type Options = [];

/**
 * Recursively find all TSTypeLiteral nodes in a type annotation,
 * but skip those inside generic type arguments (TSTypeReference params).
 * Returns all inline object type literals that should be reported.
 */
function findTypeLiterals(
  type: TSESTree.TypeNode | undefined,
  results: TSESTree.TSTypeLiteral[] = [],
  skipGenerics = false,
): TSESTree.TSTypeLiteral[] {
  if (!type) return results;

  switch (type.type) {
    case "TSTypeLiteral":
      results.push(type);
      // Don't descend into the literal's members
      return results;

    case "TSUnionType":
    case "TSIntersectionType":
      for (const t of type.types) {
        findTypeLiterals(t, results, skipGenerics);
      }
      break;

    case "TSTypeReference":
      // Skip generic type arguments as per requirement
      // (e.g., Readonly<{ a: string }> should not be flagged)
      break;

    case "TSArrayType":
      findTypeLiterals(type.elementType, results, skipGenerics);
      break;

    case "TSTupleType":
      type.elementTypes.forEach((elementType) => {
        findTypeLiterals(elementType, results, skipGenerics);
      });
      break;

    case "TSOptionalType":
      findTypeLiterals(type.typeAnnotation, results, skipGenerics);
      break;

    case "TSRestType":
      findTypeLiterals(type.typeAnnotation, results, skipGenerics);
      break;

    case "TSTypeOperator":
      findTypeLiterals(type.typeAnnotation, results, skipGenerics);
      break;

    case "TSIndexedAccessType":
      findTypeLiterals(type.objectType, results, skipGenerics);
      findTypeLiterals(type.indexType, results, skipGenerics);
      break;

    // Add other type node cases as needed
    default:
      // Ignore other type nodes (primitives, etc.)
      break;
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
    schema: [],
    messages: {
      noInlineInterfaces:
        "Extract this inline object type into a named interface or type alias and reference it here.",
    },
  },
  defaultOptions: [],
  create(context) {
    /**
     * Report all inline object type literals found in a type annotation
     */
    function reportTypeAnnotation(
      typeAnnotation: TSESTree.TypeNode | undefined,
    ) {
      const literals = findTypeLiterals(typeAnnotation);
      for (const literal of literals) {
        context.report({ node: literal, messageId: "noInlineInterfaces" });
      }
    }

    return {
      VariableDeclarator(node) {
        // Check variable type annotation
        const id = node.id as TSESTree.Node & {
          typeAnnotation?: TSESTree.TSTypeAnnotation;
        };
        if (id.typeAnnotation) {
          reportTypeAnnotation(id.typeAnnotation.typeAnnotation);
        }
      },

      FunctionDeclaration(node) {
        // Check each parameter's type annotation
        node.params.forEach((param) => {
          const p = param as TSESTree.Node & {
            typeAnnotation?: TSESTree.TSTypeAnnotation;
          };
          if (p.typeAnnotation) {
            reportTypeAnnotation(p.typeAnnotation.typeAnnotation);
          }
        });

        // Check return type annotation
        if (node.returnType) {
          reportTypeAnnotation(node.returnType.typeAnnotation);
        }
      },

      FunctionExpression(node) {
        // Check each parameter's type annotation
        node.params.forEach((param) => {
          const p = param as TSESTree.Node & {
            typeAnnotation?: TSESTree.TSTypeAnnotation;
          };
          if (p.typeAnnotation) {
            reportTypeAnnotation(p.typeAnnotation.typeAnnotation);
          }
        });

        // Check return type annotation
        if (node.returnType) {
          reportTypeAnnotation(node.returnType.typeAnnotation);
        }
      },

      ArrowFunctionExpression(node) {
        // Check each parameter's type annotation
        node.params.forEach((param) => {
          const p = param as TSESTree.Node & {
            typeAnnotation?: TSESTree.TSTypeAnnotation;
          };
          if (p.typeAnnotation) {
            reportTypeAnnotation(p.typeAnnotation.typeAnnotation);
          }
        });

        // Check return type annotation
        if (node.returnType) {
          reportTypeAnnotation(node.returnType.typeAnnotation);
        }
      },
    };
  },
});

/* eslint-disable @typescript-eslint/switch-exhaustiveness-check */
/* eslint-disable fsecond/prefer-destructured-optionals */
import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";
import { createEslintRule } from "../utils";

const RULE_NAME = "no-inline-interfaces";

type MessageIds = "noInlineInterfaces";
type Options = [
  {
    checkGenericTypes?: boolean;
    checkReturnTypes?: boolean;
  }?,
];

/**
 * Recursively find all TSTypeLiteral nodes in a type annotation.
 * Returns all inline object type literals that should be reported.
 */
const findTypeLiterals = (
  type: TSESTree.TypeNode | undefined,
  results: TSESTree.TSTypeLiteral[] = [],
  checkGenericTypes = false,
): TSESTree.TSTypeLiteral[] => {
  if (!type) {
    return results;
  }

  switch (type.type) {
    case AST_NODE_TYPES.TSTypeLiteral: {
      results.push(type);
      // Also check for nested type literals inside the members
      type.members.forEach((member) => {
        if (
          member.type === AST_NODE_TYPES.TSPropertySignature &&
          member.typeAnnotation
        ) {
          findTypeLiterals(
            member.typeAnnotation.typeAnnotation,
            results,
            checkGenericTypes,
          );
        }
      });

      return results;
    }

    case AST_NODE_TYPES.TSUnionType:
    case AST_NODE_TYPES.TSIntersectionType: {
      for (const t of type.types) {
        findTypeLiterals(t, results, checkGenericTypes);
      }
      break;
    }

    case AST_NODE_TYPES.TSTypeReference: {
      // Only check generic type arguments if checkGenericTypes is true
      if (checkGenericTypes && type.typeArguments) {
        type.typeArguments.params.forEach((param) => {
          findTypeLiterals(param, results, checkGenericTypes);
        });
      }
      break;
    }

    case AST_NODE_TYPES.TSArrayType: {
      findTypeLiterals(type.elementType, results, checkGenericTypes);
      break;
    }

    case AST_NODE_TYPES.TSTupleType: {
      type.elementTypes.forEach((elementType) => {
        findTypeLiterals(elementType, results, checkGenericTypes);
      });
      break;
    }

    case AST_NODE_TYPES.TSOptionalType: {
      findTypeLiterals(type.typeAnnotation, results, checkGenericTypes);
      break;
    }

    case AST_NODE_TYPES.TSRestType: {
      findTypeLiterals(type.typeAnnotation, results, checkGenericTypes);
      break;
    }

    case AST_NODE_TYPES.TSTypeOperator: {
      findTypeLiterals(type.typeAnnotation, results, checkGenericTypes);
      break;
    }

    case AST_NODE_TYPES.TSIndexedAccessType: {
      findTypeLiterals(type.objectType, results, checkGenericTypes);
      findTypeLiterals(type.indexType, results, checkGenericTypes);
      break;
    }

    case AST_NODE_TYPES.TSConditionalType: {
      // Check the true and false branches of conditional types
      findTypeLiterals(type.trueType, results, checkGenericTypes);
      findTypeLiterals(type.falseType, results, checkGenericTypes);
      findTypeLiterals(type.checkType, results, checkGenericTypes);
      findTypeLiterals(type.extendsType, results, checkGenericTypes);
      break;
    }
    case AST_NODE_TYPES.TSConstructorType:
    case AST_NODE_TYPES.TSFunctionType: {
      // Check parameter types and return type
      type.params.forEach((param) => {
        if (param.type === AST_NODE_TYPES.TSParameterProperty) {
          findTypeLiterals(
            param.parameter.typeAnnotation?.typeAnnotation,
            results,
            checkGenericTypes,
          );
        } else if (param.typeAnnotation) {
          findTypeLiterals(
            param.typeAnnotation.typeAnnotation,
            results,
            checkGenericTypes,
          );
        }
      });
      findTypeLiterals(
        type.returnType?.typeAnnotation,
        results,
        checkGenericTypes,
      );
      break;
    }
    case AST_NODE_TYPES.TSImportType: {
      // Check type arguments if present
      if (type.typeArguments) {
        type.typeArguments.params.forEach((param) => {
          findTypeLiterals(param, results, checkGenericTypes);
        });
      }
      break;
    }
    case AST_NODE_TYPES.TSMappedType: {
      // Check the mapped type's type annotation
      findTypeLiterals(type.typeAnnotation, results, checkGenericTypes);
      if (type.nameType) {
        findTypeLiterals(type.nameType, results, checkGenericTypes);
      }
      break;
    }
    case AST_NODE_TYPES.TSNamedTupleMember: {
      // Check the element type of the named tuple member
      findTypeLiterals(type.elementType, results, checkGenericTypes);
      break;
    }
    case AST_NODE_TYPES.TSTypePredicate: {
      // Check the parameter name type and type annotation
      if (type.typeAnnotation) {
        findTypeLiterals(
          type.typeAnnotation.typeAnnotation,
          results,
          checkGenericTypes,
        );
      }
      break;
    }
    default: {
      // Ignore other type nodes (primitives, etc.)
      break;
    }
  }

  return results;
};

/**
 * Check if a node is inside a class.
 */
const isInsideClass = (node: TSESTree.Node): boolean => {
  let current = node.parent;

  while (current) {
    if (
      current.type === AST_NODE_TYPES.ClassDeclaration ||
      current.type === AST_NODE_TYPES.ClassExpression
    ) {
      return true;
    }
    current = current.parent;
  }

  return false;
};

export default createEslintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: "suggestion",
    docs: {
      description:
        "disallow inline object type literals in variable and function annotations; extract to a named interface or type alias.",
      url: "https://github.com/AndreaPontrandolfo/eslint-plugin-fsecond/blob/master/docs/rules/no-inline-interfaces.md",
      recommended: true,
    },
    schema: [
      {
        type: "object",
        properties: {
          checkGenericTypes: {
            type: "boolean",
            description:
              "Check inline object types within generic type arguments (e.g., Array<{ a: string }>)",
          },
          checkReturnTypes: {
            type: "boolean",
            description:
              "Check inline object types in function return type annotations",
          },
        },
        additionalProperties: false,
      },
    ],
    defaultOptions: [
      {
        checkGenericTypes: false,
        checkReturnTypes: false,
      },
    ],
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
    const options = context.options[0] ?? {};
    const checkGenericTypes = options.checkGenericTypes ?? false;
    const checkReturnTypes = options.checkReturnTypes ?? false;

    /**
     * Report all inline object type literals found in a type annotation.
     */
    const reportTypeAnnotation = (
      typeAnnotation: TSESTree.TypeNode | undefined,
    ) => {
      const literals = findTypeLiterals(typeAnnotation, [], checkGenericTypes);

      for (const literal of literals) {
        context.report({ node: literal, messageId: "noInlineInterfaces" });
      }
    };

    /**
     * Check a parameter node for type annotations
     * Handles both direct parameters and parameters with default values (AssignmentPattern).
     */
    const checkParameter = (param: TSESTree.Parameter) => {
      let nodeToCheck: TSESTree.Node = param;

      // If parameter has a default value, it's wrapped in AssignmentPattern
      // The type annotation is on the 'left' side
      if (param.type === AST_NODE_TYPES.AssignmentPattern) {
        nodeToCheck = param.left;
      }

      const p = nodeToCheck as TSESTree.Node & {
        typeAnnotation?: TSESTree.TSTypeAnnotation;
      };

      if (p.typeAnnotation) {
        reportTypeAnnotation(p.typeAnnotation.typeAnnotation);
      }
    };

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

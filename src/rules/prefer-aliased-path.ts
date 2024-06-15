import { readPackageUpSync, type ReadResult } from "read-package-up";
import { minimatch } from "minimatch";
import { createEslintRule } from "../utils";

export const RULE_NAME = "prefer-aliased-path";
export type MessageIds = "preferAliasedPath";
export type Options = [];

export default createEslintRule<Options, MessageIds>({
  name: RULE_NAME,
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Suggest using a package.json alias subpath import instead of a relative import.",
    },
    schema: [
      {
        type: "object",
        additionalProperties: false,
        properties: {},
      },
    ],
    messages: {
      preferAliasedPath:
        "Use an aliased path instead of a relative path for '{{ importPath }}'.",
    },
  },
  defaultOptions: [],
  create(context) {
    let packageJson;
    const sourceCode = context.getSourceCode();

    sourceCode.ast.body.some((node) => {
      if (node.type === "ImportDeclaration") {
        const packagePath = node.source.value;

        if (packagePath.startsWith(".")) {
          packageJson = readPackageUpSync();
        }
      }
      if (packageJson) {
        return true;
      }
    });

    if (!packageJson?.packageJson?.imports) {
      return {};
    }

    return {
      ImportDeclaration(node) {
        if (node.type === "ImportDeclaration") {
          const packagePath = node.source.value;

          if (packagePath.startsWith(".")) {
            const importAliases = Object.values(
              packageJson.packageJson.imports,
            );

            for (const importAlias of importAliases) {
              if (!importAlias || typeof importAlias !== "string") {
                continue;
              }

              const capturedExtension = importAlias.endsWith(".ts")
                ? ".ts"
                : importAlias.endsWith(".js")
                ? ".js"
                : "";

              const isPathMatched = minimatch(
                `${packagePath}${capturedExtension}`,
                importAlias,
              );

              if (isPathMatched) {
                context.report({
                  node,
                  messageId: "preferAliasedPath",
                  data: {
                    importPath: packagePath,
                  },
                });
              }
            }
          }
        }
      },
    };
  },
});

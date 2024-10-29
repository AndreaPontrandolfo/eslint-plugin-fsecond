import { minimatch } from "minimatch";
import { readPackageUpSync, type ReadResult } from "read-package-up";
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
    let packageJson: ReadResult | undefined;
    const { sourceCode } = context;

    sourceCode.ast.body.some((node) => {
      if (node.type === "ImportDeclaration") {
        const packagePath = node.source.value;

        if (packagePath.startsWith(".")) {
          const currentLocalDirectory = new URL(".", import.meta.url);

          packageJson = readPackageUpSync({
            cwd: currentLocalDirectory,
          });
        }
      }

      return packageJson !== undefined;
    });

    const imports = packageJson?.packageJson?.imports;

    if (imports === undefined) {
      return {};
    }

    return {
      ImportDeclaration(node) {
        if (node.type !== "ImportDeclaration") {
          return;
        }

        const packagePath = node.source.value;

        if (packagePath.startsWith(".")) {
          const importAliases = Object.values(imports);

          for (const importAlias of importAliases) {
            if (!importAlias || typeof importAlias !== "string") {
              continue;
            }

            // eslint-disable-next-line no-nested-ternary -- Then make `switch` better.
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
      },
    };
  },
});

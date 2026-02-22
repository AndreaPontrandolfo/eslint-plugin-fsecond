import prettier from "prettier";

const config = {
  postprocess: async (content, path) => {
    return prettier.format(content, {
      ...(await prettier.resolveConfig(path)),
      parser: "markdown",
    });
  },
  ruleListColumns: [
    "name",
    "description",
    "configsError",
    "requiresTypeChecking",
    "options",
    "fixable",
    "hasSuggestions",
  ],
};

export default config;

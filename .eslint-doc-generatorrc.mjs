import prettier from "prettier";

const config = {
  postprocess: async (content, path) => {
    return prettier.format(content, {
      ...(await prettier.resolveConfig(path)),
      parser: "markdown",
    });
  },
  configEmoji: [["recommendedTypeChecked", "☑️"]],
  ruleListColumns: [
    "name",
    "description",
    "configsError",
    "options",
    "requiresTypeChecking",
    "fixable",
    "hasSuggestions",
  ],
};

export default config;

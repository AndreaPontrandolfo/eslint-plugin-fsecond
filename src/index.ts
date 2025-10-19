import noInlineInterfaces from "./rules/no-inline-interfaces";
// import preferAliasedPath from "./rules/prefer-aliased-path";
import preferDestructuredOptionals from "./rules/prefer-destructured-optionals";
import validEventListener from "./rules/valid-event-listener";

const plugin = {
  meta: {
    name: "eslint-plugin-fsecond",
    version: "2.0.0",
  },
  configs: {},
  rules: {
    "prefer-destructured-optionals": preferDestructuredOptionals,
    "valid-event-listener": validEventListener,
    // "prefer-aliased-path": preferAliasedPath,
    "no-inline-interfaces": noInlineInterfaces,
  },
};

// assign configs here so we can reference `plugin`
Object.assign(plugin.configs, {
  recommended: [
    {
      plugins: {
        fsecond: plugin,
      },
      rules: {
        "fsecond/prefer-destructured-optionals": 2,
        "fsecond/valid-event-listener": 2,
        "fsecond/no-inline-interfaces": [
          2,
          { checkGenericTypes: false, checkReturnTypes: true },
        ],
      },
    },
  ],
});

export default plugin;

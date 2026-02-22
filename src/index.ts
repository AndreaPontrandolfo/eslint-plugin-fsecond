import packageJson from "../package.json";
import noInlineInterfaces from "./rules/no-inline-interfaces";
import noRedundantJsxPropUsage from "./rules/no-redundant-jsx-prop-usage";
// import preferAliasedPath from "./rules/prefer-aliased-path";
import preferDestructuredOptionals from "./rules/prefer-destructured-optionals";
import validEventListener from "./rules/valid-event-listener";

const eslintPluginShortName = "fsecond";

const plugin = {
  meta: { name: packageJson.name, version: packageJson.version },
  configs: {},
  rules: {
    "prefer-destructured-optionals": preferDestructuredOptionals,
    "valid-event-listener": validEventListener,
    // "prefer-aliased-path": preferAliasedPath,
    "no-inline-interfaces": noInlineInterfaces,
    "no-redundant-jsx-prop-usage": noRedundantJsxPropUsage,
  },
};

const configs = {
  recommended: [
    {
      plugins: {
        fsecond: plugin,
      },
      rules: {
        [`${eslintPluginShortName}/prefer-destructured-optionals`]: 2,
        [`${eslintPluginShortName}/valid-event-listener`]: 2,
        [`${eslintPluginShortName}/no-inline-interfaces`]: [
          2,
          { checkGenericTypes: false, checkReturnTypes: true },
        ],
      },
    },
  ],
  recommendedTypeChecked: [
    {
      plugins: {
        fsecond: plugin,
      },
      rules: {
        [`${eslintPluginShortName}/prefer-destructured-optionals`]: 2,
        [`${eslintPluginShortName}/valid-event-listener`]: 2,
        [`${eslintPluginShortName}/no-inline-interfaces`]: [
          2,
          { checkGenericTypes: false, checkReturnTypes: true },
        ],
        [`${eslintPluginShortName}/no-redundant-jsx-prop-usage`]: 2,
      },
    },
  ],
};

plugin.configs = configs;

type Plugin = typeof plugin & {
  configs: typeof configs;
};

export default plugin as Plugin;

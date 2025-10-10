import preferAliasedPath from "./rules/prefer-aliased-path";
import preferDestructuredOptionals from "./rules/prefer-destructured-optionals";
import validEventListener from "./rules/valid-event-listener";
import noInlineInterfaces from "./rules/no-inline-interfaces";

const plugin = {
  meta: {
    name: "eslint-plugin-fsecond",
    version: "1.1.0",
  },
  rules: {
    "prefer-destructured-optionals": preferDestructuredOptionals,
    "valid-event-listener": validEventListener,
    "prefer-aliased-path": preferAliasedPath,
    "no-inline-interfaces": noInlineInterfaces,
  },
};

export default plugin;

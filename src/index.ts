import preferDestructuredOptionals from "./rules/prefer-destructured-optionals";
import ensureMatchingRemoveEventListener from "./rules/ensure-matching-remove-event-listener";

const plugin = {
  meta: {
    name: "eslint-plugin-fsecond",
    version: "1.1.0",
  },
  rules: {
    "prefer-destructured-optionals": preferDestructuredOptionals,
    "ensure-matching-remove-event-listener": ensureMatchingRemoveEventListener,
  },
};

export default plugin;

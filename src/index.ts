import preferDestructuredOptionals from "./rules/prefer-destructured-optionals";
import ensureMatchingRemoveEventListener from "./rules/ensure-matching-remove-event-listener";

export default {
  rules: {
    "prefer-destructured-optionals": preferDestructuredOptionals,
    "ensure-matching-remove-event-listener": ensureMatchingRemoveEventListener,
  },
};

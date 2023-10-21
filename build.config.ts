import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: ["src/index"],
  declaration: false,
  rollup: {
    emitCJS: true,
  },
});

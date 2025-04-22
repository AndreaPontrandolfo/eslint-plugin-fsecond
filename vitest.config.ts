import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: [import.meta.resolve("./src/rules/setup-test.ts")],
    typecheck: {
      enabled: true,
    },
    sequence: {
      concurrent: true,
      shuffle: {
        tests: true,
        files: false,
      },
    },
  },
});

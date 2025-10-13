import { defineConfig } from "tsdown";

export default defineConfig({
  shims: true,
  sourcemap: true,
  dts: true,
  publint: { strict: true },
  attw: { level: "error", profile: "esmOnly" },
});

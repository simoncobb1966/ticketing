import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    // exclude: ["**/db/seed.ts/**", "**/node_modules/**"],
    environment: "jsdom",
    // include: ["**/*.{test, spec}.{js, jsx, ts, tsx}"],
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
  },
  resolve: {
    tsconfigPaths: true,
  },
});

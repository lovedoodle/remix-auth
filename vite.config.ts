import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    remix({
      ignoredRouteFiles: ["**/*.css"],
    }),
    tsconfigPaths(),
  ],
  server: {
    proxy: {},
    https: {
      key: "./key.pem",
      cert: "./cert.pem",
    },
    host: "local.jogg.co",
    port: 443,
  },
});

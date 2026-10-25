import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react-swc";
import { build } from "vite";

const mode = process.argv[2] || "production";

await build({
  configFile: false,
  mode,
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("../src", import.meta.url)),
    },
  },
});

import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react-swc";
import { createServer } from "vite";

const server = await createServer({
  configFile: false,
  plugins: [react()],
  server: { host: "::", port: 8080 },
  resolve: { alias: { "@": fileURLToPath(new URL("../src", import.meta.url)) } },
});

await server.listen();
server.printUrls();
server.bindCLIShortcuts({ print: true });

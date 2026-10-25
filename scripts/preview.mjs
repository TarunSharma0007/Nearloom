import { preview } from "vite";

const server = await preview({
  configFile: false,
  preview: {
    host: process.env.HOST || "127.0.0.1",
    port: Number(process.env.PORT || 4173),
  },
});

server.printUrls();

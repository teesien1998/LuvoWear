import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import http from "http";

// Create a custom agent to manage connection pooling
const agent = new http.Agent({
  keepAlive: true,
  keepAliveMsecs: 10000,
  maxSockets: 100,
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:6000",
        changeOrigin: true,
        agent: agent,
      },
    },
  },
});

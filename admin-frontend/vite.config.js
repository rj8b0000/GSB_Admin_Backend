import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { websocketFix } from "./vite-websocket-fix.js";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), websocketFix()],
  server: {
    port: 3001,
    host: "0.0.0.0",
    hmr: {
      port: 3001,
      host: "localhost",
      overlay: false,
      clientPort: 3001,
    },
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
    },
    watch: {
      usePolling: false,
      interval: 100,
    },
  },
});

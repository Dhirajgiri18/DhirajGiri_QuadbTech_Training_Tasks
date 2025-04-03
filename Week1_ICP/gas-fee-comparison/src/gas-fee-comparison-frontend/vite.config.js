import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import envCompatible from "vite-plugin-env-compatible";

export default defineConfig({
  plugins: [react(), envCompatible()],
  define: {
    global: "window",
    "process.env": {},
  },
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:4943",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

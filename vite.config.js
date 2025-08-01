import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  resolve: {
    alias: {
      crypto: "crypto-browserify",
    },
  },
  plugins: [react()],
  server: {
    host: "0.0.0.0", // Bind to all interfaces
    port: 5173,
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

declare const process: { cwd(): string };

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: /^@\/(.*)$/, replacement: `${process.cwd()}/src/$1` },
    ],
  },
  server: {
    port: 5173,
  },
});

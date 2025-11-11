import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({

  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate", // 자동 업데이트
      manifest: {
        name: "STAGE ON",
        short_name: "StageOn",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#C66CD9",
        icons: [
          {
            src: "/stageon_192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/stageon_512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});


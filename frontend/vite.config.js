// vite.config.ts
import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { VitePWA } from "vite-plugin-pwa"

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      includeAssets: ["favicon-16.png", "favicon-32.png", "apple-touch-icon.png", "robots.txt"],
      manifest: {
        short_name: "Pathfinder",
        name: "Pathfinder NGO Counseling Lucknow",
        description: "Book counseling sessions, explore mental health resources, and stay connected with Pathfinder NGO Lucknow.",
        start_url: "/",
        scope: "/",
        background_color: "#ffffff",
        theme_color: "#0ea5e9",
        display: "standalone",
        orientation: "portrait",
        icons: [
          { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        // Never cache API calls with a stale-first strategy — always try the network,
        // only falling back to a cached copy if the device is offline.
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith("/api/"),
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              networkTimeoutSeconds: 8,
              cacheableResponse: { statuses: [0, 200] },
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 },
            },
          },
          {
            urlPattern: ({ url }) => url.hostname.includes("res.cloudinary.com"),
            handler: "CacheFirst",
            options: {
              cacheName: "cloudinary-images",
              cacheableResponse: { statuses: [0, 200] },
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})

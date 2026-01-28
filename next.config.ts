import type { NextConfig } from "next";
import withPWA from "@ducanh2912/next-pwa";

const nextConfig: NextConfig = {
};

export default withPWA({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
    skipWaiting: true,
    clientsClaim: true,
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/.*\.supabase\.co\/rest\/v1\/.*$/,
        handler: "NetworkOnly",
        options: {
          cacheName: "supabase-data-no-cache",
        },
      },
      {
        urlPattern: /^https:\/\/.*\.supabase\.co\/storage\/v1\/object\/public\/.*$/,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "supabase-storage",
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
    ],
  },
})(nextConfig);

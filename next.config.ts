import type { NextConfig } from "next";
import withPWA from "@ducanh2912/next-pwa";

const nextConfig: NextConfig = {
};

export default withPWA({
  dest: "public",
  cacheOnFrontEndNav: false,
  aggressiveFrontEndNavCaching: false,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
    skipWaiting: true,
    clientsClaim: true,
    cleanupOutdatedCaches: true,
    runtimeCaching: [
      // HTML pages - always fetch from network first
      {
        urlPattern: /^https?:\/\/[^/]+\/?(?:dashboard|auth|profile)?.*$/,
        handler: "NetworkFirst",
        options: {
          cacheName: "pages-cache",
          networkTimeoutSeconds: 10,
          expiration: {
            maxEntries: 32,
            maxAgeSeconds: 60 * 60, // 1 hour
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
      // Next.js data requests - always network first
      {
        urlPattern: /\/_next\/data\/.+\/.+\.json$/,
        handler: "NetworkFirst",
        options: {
          cacheName: "next-data-cache",
          networkTimeoutSeconds: 10,
          expiration: {
            maxEntries: 32,
            maxAgeSeconds: 60 * 60, // 1 hour
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
      // Supabase API - always network only (no cache)
      {
        urlPattern: /^https:\/\/.*\.supabase\.co\/rest\/v1\/.*$/,
        handler: "NetworkOnly",
        options: {
          cacheName: "supabase-api-no-cache",
        },
      },
      // Supabase Auth - always network only
      {
        urlPattern: /^https:\/\/.*\.supabase\.co\/auth\/.*$/,
        handler: "NetworkOnly",
        options: {
          cacheName: "supabase-auth-no-cache",
        },
      },
      // Supabase Storage (images/files) - cache with revalidation
      {
        urlPattern: /^https:\/\/.*\.supabase\.co\/storage\/v1\/object\/public\/.*$/,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "supabase-storage",
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
      // Static assets - cache first (these rarely change)
      {
        urlPattern: /\.(?:js|css|woff2?|ttf|otf|eot)$/,
        handler: "CacheFirst",
        options: {
          cacheName: "static-assets",
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
      // Images - stale while revalidate
      {
        urlPattern: /\.(?:png|jpg|jpeg|gif|svg|webp|ico)$/,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "images-cache",
          expiration: {
            maxEntries: 60,
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

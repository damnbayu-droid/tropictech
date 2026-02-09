import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  serverExternalPackages: ["@prisma/client"],

  typescript: {
    ignoreBuildErrors: true,
  },

  reactStrictMode: true,

  experimental: {
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons", "date-fns"],
  },

  turbopack: {
    root: "/Users/bayu/Documents/ANTIGRAVITY/TropicTechAntigravity",
  },

  images: {
    qualities: [75, 85],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.i.ibb.co.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  compress: true,
};

export default nextConfig;

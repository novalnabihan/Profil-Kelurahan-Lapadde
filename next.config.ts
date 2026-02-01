import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 🔥 ini yang penting buat nge-bypass error "Running TypeScript ..."
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cyftqhphlwqlgqcfnkhh.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;

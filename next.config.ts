import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Supabase Storage public URLs: <project-ref>.supabase.co/storage/v1/object/public/...
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
};

export default nextConfig;

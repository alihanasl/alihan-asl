import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  agentRules: false,
  images: {
    localPatterns: [{ pathname: "/uploads/**", search: "" }],
    qualities: [75, 90, 100],
  },
  async redirects() {
    return [
      {
        source: "/projects/laniff",
        destination: "/projects/it-asset-management",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

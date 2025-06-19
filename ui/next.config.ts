import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  productionBrowserSourceMaps: false,
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.devtool = 'eval-source-map';
    }
    return config;
  },
};

export default nextConfig;

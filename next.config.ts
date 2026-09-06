import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" }],
  },
};

export default nextConfig;

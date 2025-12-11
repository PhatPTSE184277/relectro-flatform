import type { NextConfig } from "next";

const nextConfig = {
  images: {
    domains: ['picsum.photos'],
  },
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://160.187.1.125:5000/api/:path*',
      },
    ];
  },
};

export default nextConfig;

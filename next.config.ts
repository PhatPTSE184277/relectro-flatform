import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['picsum.photos', 'lh3.googleusercontent.com', 'res.cloudinary.com'],
  },
  experimental: {
  },
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
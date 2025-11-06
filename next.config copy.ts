/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://160.187.1.125:5000/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
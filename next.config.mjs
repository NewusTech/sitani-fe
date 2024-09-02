/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [{
      source: '/api-backend/:path*',
      destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/:path*`,
    }, ]
  },
};

export default nextConfig;

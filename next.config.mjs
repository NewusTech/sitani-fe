/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['newus-bucket.s3.ap-southeast-2.amazonaws.com'],
  },
  async rewrites() {
    return [{
      source: '/api-backend/:path*',
      destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/:path*`,
    }];
  },
};

export default nextConfig;

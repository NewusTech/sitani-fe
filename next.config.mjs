/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async rewrites() {
      return [{
        source: '/api-backend/:path*',
        destination: `https://backend-sitani.newus.id/api/:path*`,
      }, ]
    },
  };
  
  export default nextConfig;
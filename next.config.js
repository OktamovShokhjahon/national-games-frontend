/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["framer-motion"],
  images: {
    domains: ["localhost", "95.130.227.114"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "95.130.227.114",
        pathname: "/uploads/**",
      },
    ],
  },
};

module.exports = nextConfig;

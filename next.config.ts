
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.dummyjson.com", // if you're showing product images
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;

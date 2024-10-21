/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000, // Check for changes every 1 second
        aggregateTimeout: 300, // Delay before rebuilding
      };
    }
    return config;
  },
};

module.exports = nextConfig;

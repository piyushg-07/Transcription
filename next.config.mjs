/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Handle Remotion bundling
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
    };
    
    return config;
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '500mb',
    },
  },
};

export default nextConfig;

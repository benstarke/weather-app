/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*', // Proxy to Laravel API
      },
    ];
  },
  webpack(config: import('webpack').Configuration) {
    // Add fallbacks for Node.js modules
    config.resolve = {
      ...config.resolve, // Preserve existing resolve settings
      fallback: {
        ...(config.resolve?.fallback || {}), // Preserve existing fallbacks or use empty object
        fs: false, // Ignore fs module
        path: false, // Ignore path module
        os: false, // Ignore os module
      },
    };
    return config;
  },
  images: {
    // domains: ['openweathermap.org'], 
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'openweathermap.org', // Allow images from openweathermap.org
        pathname: '/img/wn/**',
      },
    ],
  },
};

export default nextConfig;
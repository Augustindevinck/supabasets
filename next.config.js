/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  
  // Allow dev server access from Replit proxy
  allowedDevOrigins: [
    'localhost',
    '127.0.0.1',
    '.replit.dev',
    '.riker.replit.dev',
  ],
  
  experimental: {
    optimizePackageImports: [
      '@headlessui/react',
      '@tabler/icons-react',
      'daisyui',
      'aceternity-ui',
      'framer-motion',
      'react-hot-toast',
      'react-tooltip',
    ],
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'pbs.twimg.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'logos-world.net',
      },
    ],
  },
};

module.exports = nextConfig;

// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Enables React Strict Mode for highlighting potential problems in the app
  swcMinify: true,       // Enables the use of the SWC compiler for faster builds
  // Additional configurations can be added here
  // images: {
  //   domains: ['example.com'], // Replace with domains you want to allow for optimized images
  // },
  webpack: (config, { isServer }) => {
    // Customize the Webpack configuration here
    if (!isServer) {
      config.resolve.fallback.fs = false; // Example: disabling the 'fs' module on the client side
    }
    return config;
  },
  env: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  }
}

module.exports = nextConfig

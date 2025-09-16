import path from 'path'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      allowedOrigins: ["*"]
    }
  },
  webpack: (config) => {
    // Ensure @ alias resolves to src for both TS and Webpack
    config.resolve = config.resolve || {}
    config.resolve.alias = config.resolve.alias || {}
    config.resolve.alias['@'] = path.resolve(process.cwd(), 'src')
    return config
  }
};

export default nextConfig;

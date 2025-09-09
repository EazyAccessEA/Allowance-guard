/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure Turbopack (updated syntax)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  // Keep webpack config for production builds
  webpack: (config: any) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    return config
  }
}
module.exports = nextConfig

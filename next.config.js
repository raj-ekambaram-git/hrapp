module.exports = {
  reactStrictMode: false,
  serverRuntimeConfig: {
    apiUrl: process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/api' // development api
    ? process.env.NODE_ENV === 'vercel'
    : "https://hrapp-nse9.vercel.app/"
    : 'https://mpik62bzs8.us-east-1.awsapprunner.com/api', // production api
      secret: '123456789',
      clientId: '11122'
  },
  publicRuntimeConfig: {
      apiUrl: process.env.NODE_ENV === 'development'
          ? 'http://localhost:3000/api' // development api
          ? process.env.NODE_ENV === 'vercel'
          : "https://hrapp-nse9.vercel.app/"      
          : 'https://mpik62bzs8.us-east-1.awsapprunner.com/api' // production api
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
}

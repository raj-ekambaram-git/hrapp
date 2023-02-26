module.exports = {
  reactStrictMode: false,
  serverRuntimeConfig: {
    apiUrl: process.env.NODE_ENV === 'development'
    ? 'http:///local.backofficeneeds.com/api' // development api
    : process.env.NODE_ENV === 'awsdev'
    ? 'https://apmpmfa7ay.us-east-1.awsapprunner.com/api'
    : 'https://local.backofficeneeds.com/api', // production api
      secret: '123456789',
      clientId: '11122',
    schedulerAPIURL: process.env.NODE_ENV === 'development'
    ? 'https://devapi.backofficeneeds.com' // development api
    : process.env.NODE_ENV === 'awsdev'
    ? 'https://apmpmfa7ay.us-east-1.awsapprunner.com/api'
    : 'https://devapi.backofficeneeds.com', // production api
  },
  publicRuntimeConfig: {
      apiUrl: process.env.NODE_ENV === 'development'
          ? 'https://local.backofficeneeds.com/api' // development api
          : process.env.NODE_ENV === 'awsdev'
          ? 'https://apmpmfa7ay.us-east-1.awsapprunner.com/api'
          : 'https://local.backofficeneeds.com/api', // production api
      schedulerAPIURL: process.env.NODE_ENV === 'development'
      ? 'https://devapi.backofficeneeds.com' // development api
      : process.env.NODE_ENV === 'awsdev'
      ? 'https://apmpmfa7ay.us-east-1.awsapprunner.com/api'
      : 'https://devapi.backofficeneeds.com', // production api          
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

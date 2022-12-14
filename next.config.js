module.exports = {
  reactStrictMode: false,
  serverRuntimeConfig: {
      secret: '123456789'
  },
  publicRuntimeConfig: {
      apiUrl: process.env.NODE_ENV === 'development'
          ? 'http://localhost:3000/api' // development api
          : 'http://localhost:3000/api' // production api
  }
}

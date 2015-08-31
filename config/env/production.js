module.exports = {
  connections : {
    mongoLive: {
      adapter: 'sails-mongo',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    }
  },
  models: {
     connection: 'mongoLive'
  },
  port: process.env.PORT || '8081',
  environment: process.env.NODE_ENV || 'production'
};

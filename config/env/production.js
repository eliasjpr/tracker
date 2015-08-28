module.exports = {
  connections : {
    mongoLive: {
      adapter: 'sails-mongo',
      host: 'ec2-23-21-222-200.compute-1.amazonaws.com',
      port: 27017,
      // user: 'liana_user',
      // password: 'PINCHme123',
      database: 'lianadb_dev'
    }
  },
  models: {
     connection: 'mongoLive'
  },
  port: '80',
  environment: 'production'
};

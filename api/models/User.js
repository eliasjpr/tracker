/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  connection: 'PinchMeReadDB',
  tableName: 'users',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  autoDeletedAt: false,
  attributes: {
    id: {
      type: 'integer',
      primaryKey: true,
      unique: true
    },
    first_name: 'string',
    last_name: 'string',
    email: {
      type: 'string',
      email: true
    },
    mobile: 'string',
    postcode: 'string',
    birthdate: 'date',
    created_at: 'datetime',
    updated_at: 'datetime',
    pages: {
      collection: 'page',
      via: 'user'
    }
  }
};


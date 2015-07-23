/**
* Page.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    userId: { type: 'integer'},
    campaignID: {type: 'json'},
    window:{type: 'json'},
    dom_object: {type: 'json'},
    navigator: {type: 'json'},
    history: {type: 'json'},
    location: {type: 'json'}
  }
};


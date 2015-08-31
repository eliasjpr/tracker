/**
 * PageController
 *
 * @description :: Server-side logic for managing pages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var request = require('request');

module.exports = {
  'create': function(req, res){

    request('http://www.telize.com/geoip/108.176.21.134')
      .on('error', function(error){ console.log(error) } )
      .on('response', function(response){

        req.body.geolocation = response.body;
        req.body.ip       = req.ip || req.socket.handshake.address || '0.0.0.0';
        req.body.headers  = req.headers || req.socket.handshake.headers;
        req.body.secure   = req.secure;
        req.body.query    = req.query;
        req.body.params   = req.params;
        req.body.user     = req.cookies.uxid || 0;
        req.body.campaign = req.cookies.cxid || 0;

        Page.create(req.body).exec(function createCB(err, page){
          if(err){ return res.json( 500, err); }
          req.isSocket ? Page.publishCreate(page) : res.json(200, page);
        });

      });


  }
};


/**
 * PageController
 *
 * @description :: Server-side logic for managing pages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = {
  'create': function(req, res){

    req.body.ip       = req.ip || req.socket.handshake.address;
    req.body.headers  = req.headers || req.socket.handshake.headers;
    req.body.secure   = req.secure;
    req.body.query    = req.query;

    Page.create(req.body).exec(function createCB(err, page){
      if(err){ return res.json( 500, err); }

      req.isSocket ? Page.publishCreate(page) : res.json(200, page);

      //res.json(200, page);
    });
  }
};


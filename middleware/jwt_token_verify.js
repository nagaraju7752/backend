var jwt = require('jsonwebtoken');
var config_env = require('../config/config');
var get_env_values_object = config_env.getEnvValues(process.env.ENVIRONMENT);
exports.validateJWToken = (req, res, next) => {

    var token = req.headers['authentication'];
    var resp_data = {
        is_error:true,
        display_msg:"No token provided.",
        data:null,
        auth:false,
    };
  if (!token) return res.status(401).send(resp_data);
  var split_token = token.split(' ');
  token = split_token[1];
  //console.log('AAAAAA',token);
  jwt.verify(token, get_env_values_object.secret, function(err, decoded) {
    var resp_data = {
        is_error:true,
        display_msg:"Session Expired! Please Login again",
        data:null,
        auth:false,
    };
    if (err) return res.status(200).send(resp_data);
    
    //res.status(200).send(decoded);
   // console.log('DECODED',decoded);
    return next();
  });

};
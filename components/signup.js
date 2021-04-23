var Router = require("express");
const router = Router();
var config_env = require("../config/config");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var User_schema = require("../schemas/user_schema");
var display_msg = null;

var get_env_values_object = config_env.getEnvValues(process.env.ENVIRONMENT);

router.post("/verifyJWT", function(req, res) {
  //console.log("SECRET", get_env_values_object.secret);

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
  //console.log('DECODED',decoded);
  var resp_data = {
    is_error:false,
    display_msg:"",
    data:null,
    auth:true,
};
  return res.status(200).send(resp_data);
  
});
});

router.post("/register", function(req, res) {
  //console.log("SECRET", get_env_values_object.secret);

  findCheck(req, res, cb);
});

function findCheck(req, res, cb) {
  User_schema.findOne({ email: req.body.email }, function(err, user) {
    //console.log("DSTA", user);
    if (user == null) {
      cb(req, res, false);
    } else {
      cb(req, res, true);
    }
  });
}

function cb(req, res, flag) {
  if (flag == true) {
    display_msg = "User Already Exists! Please login.";
    var resp_data = {
      is_error: true,
      display_msg: display_msg,
      data: null
    };
    return res.status(200).send(resp_data);
  }
  var hashedPassword = bcrypt.hashSync(req.body.password, 8);
  //return res.status(200).send("NPPP.")
  User_schema.create(
    {
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      status:'Y'
    },
    function(err, user) {
    //  console.log("Error in Signup", err);
      if (err) {
        display_msg = "Some thing went wrong!";
        var resp_data = {
          is_error: true,
          display_msg: display_msg,
          data: null
        };
        return res.status(500).send(resp_data);
        //helper_functions.failure_response(req,res,data,display_msg);
      }
      //  res.status(500).send("There was a problem registering the user.")
      // create a token
      /* var token = jwt.sign({ id: user._id }, get_env_values_object.secret, {
      expiresIn: get_env_values_object.session_timeout //getting from config file
    });*/
      //res.status(200).send({ auth: true, token: token });

      display_msg = "Successfully Registered! Please Login.";
      // data = { data: user };
      var resp_data = {
        is_error: false,
        display_msg: display_msg,
        data: null
      };
      return res.status(200).send(resp_data);
      //helper_functions.success_responses(req,res,data,display_msg);
    }
  );
}

module.exports = router;

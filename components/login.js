var Router = require('express');
const router = Router();
var config_env = require('../config/config');
var get_env_values_object = config_env.getEnvValues(process.env.ENVIRONMENT);
var config_env = require('../config/config');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var User_schema = require('../schemas/user_schema');
var atob = require('atob');

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(get_env_values_object.SENDGRID_API_KEY);

var display_msg = null;
var data = null;

router.post('/login', function (req, res) {
    var usersProjection = { 
        __v: false,
        status: false,
    };
    User_schema.findOne({ email: req.body.email,status:'Y' },usersProjection, function (err, user) {
        if (err){
            var resp_data = {
                is_error: true,
                display_msg:"Some thing went wrong",
                data: { auth: false, token: null,userData:null }
              };
              return res.status(200).send(resp_data);
        } 
        if (!user){
            var resp_data = {
                is_error: true,
                display_msg:"No User Found",
                data: { auth: false, token: null,userData:null }
              };
              return res.status(200).send(resp_data);
        }
        
        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        
        var resp_data = {
            is_error: true,
            display_msg:"Invalid Password",
            data: { auth: false, token: null,userData:null }
          };
        if (!passwordIsValid) return res.status(200).send(resp_data);
        
        var token = jwt.sign({ id: user._id }, get_env_values_object.secret, {
          expiresIn: get_env_values_object.session_timeout // expires in 15 minutes
        });
      
        var users_data ={
            "id":user._id,
            "name": user.name,
            "email": user.email
        };
        var resp_data = {
            is_error: false,
            display_msg: display_msg,
            data: { auth: true, token: token,userData:users_data }
          };
        res.status(200).send(resp_data);
      });


});



router.post('/generateResetPasswordLink', function (req, res) {
  var usersProjection = { 
      __v: false,
      status: false,
  };
  console.log(req.body.email);
  User_schema.findOne({ email: req.body.email},usersProjection, function (err, user) {
    //console.log(err);
      if (err){
          var resp_data = {
              is_error: true,
              display_msg:"Some thing went wrong",
              data: { auth: false, token: null,userData:null }
            };
            return res.status(200).send(resp_data);
      } 
      if (!user){
          var resp_data = {
              is_error: true,
              display_msg:"No User Found",
              data: { auth: false, token: null,userData:null }
            };
            return res.status(200).send(resp_data);
      }

      var user_id = user._id;
      var convertstring = atob(JSON.stringify(user_id));
      const msg = {
        to: req.body.email, // Change to your recipient
        from: get_env_values_object.from_email,
        subject: 'Reset Password From onPassive',
        text: 'Reset Password Your Password',
        html: `<p>Thanks For Using Reset PasswordService.Please use this <a href='${get_env_values_object.reset_url}/new-password?s=${convertstring}'>Reset Link</a> To Reset Password.</p>`,
      };
    //  console.log('Iput',msg);
      sgMail
        .send(msg)
        .then(() => {
          var resp_data = {
            is_error: false,
            display_msg:"Email Sent Successfully to your mail.",
            data: { auth: false, token: null,userData:null }
          };
          return res.status(200).send(resp_data);
          //console.log('Email sent')
        })
        .catch((error) => {
          console.error('--------------=====',error)
          var resp_data = {
            is_error: true,
            display_msg:"Some Thing Went Wrong!",
            data: { auth: false, token: null,userData:null }
          };
          return res.status(200).send(resp_data);
        })



    });

  });


  router.post('/resetpassword', function (req, res) {
    var usersProjection = { 
        __v: false,
        status: false,
    };
    var password_crypt = bcrypt.hashSync(req.body.password, 8);
    var user_id = req.body.user_id;
    var input_request = { _id:user_id};
    update_employeePassword(req,res,input_request,password_crypt,cb)
  
    });




    function update_employeePassword(req,res,input_query,password_crypt,cb)
{
   
  //var New_password = req.body.password;
    //console.log('Bedfore',fullName_main,input_query);
    User_schema.findOne(input_query, function (err, user) {
       
       // console.log('Fter',fullName_main,'---',user);

        user.password= password_crypt;
       
        user.save(function (err) {
            if(err) {
                console.error('ERROR!');
                cb(req, res, true, "update", user);
            }
            cb(req, res, false, "update", user);
        });
    });
}

function cb(req, res, flag, module, data)
{
  
  if (flag == true) {
    if (module == "update") {
      display_msg = "Some Thing Went Wrong!";
      var resp_data = {
        is_error: true,
        display_msg: display_msg,
        data: null,
        auth: false
      };
      return res.status(200).send(resp_data);
    }

  }

  if (module == "update") {
    display_msg = "Password Changed Successfully!";
    var resp_data = {
      is_error: false,
      display_msg: display_msg,
      data: null,
      auth: true
    };
    return res.status(200).send(resp_data);
  }

}


module.exports = router;
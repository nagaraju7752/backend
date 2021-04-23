var Router = require("express");
const router = Router();

var config_env = require("../config/config");
var middleware = require("../middleware/jwt_token_verify");

var employee_schema = require("../schemas/employee_schema");
var display_msg = null;
var data = null;
var input_query = null;

var fullName_main = null;
var jobtitle = null;
var empId = null;
var depart = null;
var loc = null;
var age = null;
var sal = null;
var status=null;

//var access_token_model = require('../models/accesstoken_generation_model');
//var async = require('async');

//var db = require('../config/db');

var get_env_values_object = config_env.getEnvValues(process.env.ENVIRONMENT);

router.post("/create", [middleware.validateJWToken], function(req, res) {
 // console.log("Came to create");
  input_query = { emp_id: req.body.empId };
  findOneEmployee(req, res,input_query, cb);
});

router.get("/list", [middleware.validateJWToken], function(req, res) {
   // console.log("Came to list");
    var params_data = req.query.userId;
  //  console.log('Params Data');
    input_query =  { "userId": params_data };
    getEmployees(req, res,input_query, cb);
  });

  router.post("/update", [middleware.validateJWToken], function(req, res) {
  //  console.log("Came to Update");
    input_query = { "_id": req.body.id };
    update_employeeData(req,res,input_query, cb);
  });

  router.post("/delete", [middleware.validateJWToken], function(req, res) {
  //  console.log("Came to Delete");
    input_query = { "_id": req.body.id };
    delete_employee(req, res,input_query, cb);
  });


function update_employeeData(req,res,input_query, cb)
{
    fullName_main = req.body.fullName;
    jobtitle = req.body.jobTitle;
    empId = req.body.empId;
    depart = req.body.department;
    loc = req.body.location;
    age = req.body.age;
    sal = req.body.salary;
   // console.log('Bedfore',fullName_main,input_query);
    employee_schema.findOne(input_query, function (err, user) {
       
       // console.log('Fter',fullName_main,'---',user);

        user.full_name= fullName_main;
        user.job_title= jobtitle;
        user.emp_id= empId;
        user.department= depart;
        user.location= loc;
        user.age= age;
        user.salary= sal;
     
        user.save(function (err) {
            if(err) {
                console.error('ERROR!');
                cb(req, res, true, "update", user);
            }
            cb(req, res, false, "update", user);
        });
    });
}

function delete_employee(req,res,input_query, cb)
{
    status = req.body.status;
    console.log(input_query)
    employee_schema.findOne(input_query, function (err, user) {
       
      console.log(user);
        user.status= status;
     
        user.save(function (err) {
            if(err) {
                console.error('ERROR!');
                cb(req, res, true, "delete", user);
            }
            cb(req, res, false, "delete", user);
        });
    });
}


function findOneEmployee(req, res,input_query, cb) {
  employee_schema.findOne(input_query, function(err, user) {
    //console.log("DSTA", user);
    if (user == null) {
        
            cb(req, res, false, "insertion", null);
        
      
    } else {
       
            cb(req, res, true, "insertion", null);
       
    }
  });
}


function getEmployees(req, res,input_query, cb) {
    var usersProjection = { 
        __v: false,
    };
    employee_schema.find(input_query,usersProjection,function(err, user) {
      //console.log("DSTA", user);
      cb(req, res, false, "list", user);
    });
  }


function cb(req, res, flag, module, data) {
  if (flag == true) {
    if (module == "insertion") {
      display_msg = "Employee Already Exists! Try with Different Employee Id.";
      var resp_data = {
        is_error: true,
        display_msg: display_msg,
        data: null,
        auth: true
      };
      return res.status(200).send(resp_data);
    }

    if (module == "update") {
        display_msg = "Failed to update!";
        var resp_data = {
          is_error: true,
          display_msg: display_msg,
          data: null,
          auth: true
        };
        return res.status(200).send(resp_data);
      }
      if (module == "delete") {
        display_msg = "Failed to Delete Employee!";
        var resp_data = {
          is_error: true,
          display_msg: display_msg,
          data: null,
          auth: true
        };
        return res.status(200).send(resp_data);
      }
  }

  if (module == "insertion") {
    employee_schema.create(
      {
        full_name: req.body.fullName,
        job_title: req.body.jobTitle,
        emp_id: req.body.empId,
        department: req.body.department,
        location: req.body.location,
        age: req.body.age,
        salary: req.body.salary,
        status: "Y",
        userId:req.body.userId,
      },
      function(err, user) {
        //console.log("Error in Signup", err);
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

        display_msg = "Employee Created Successfully!";
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

  if (module == "list") {

    display_msg = null;
    var resp_data = {
      is_error: false,
      display_msg: display_msg,
      data: data,
      auth: true
    };
    return res.status(200).send(resp_data);
  }
  if (module == "update") {

    display_msg = "Successfully Updated The Employee";
    var resp_data = {
      is_error: false,
      display_msg: display_msg,
      data: data,
      auth: true
    };
    return res.status(200).send(resp_data);
  }

  if (module == "delete") {

    display_msg = "Successfully Deleted The Employee";
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

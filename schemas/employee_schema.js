var mongoose = require('mongoose');  
var employee_schema = new mongoose.Schema({  
  full_name: String,
  job_title: String,
  emp_id:String,
  department: String,
  location: String,
  age: String,
  salary: String,
  status:String,
  userId:String,
});

module.exports = mongoose.model('Employees', employee_schema);
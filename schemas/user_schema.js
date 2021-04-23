var mongoose = require('mongoose');  
var user_schema = new mongoose.Schema({  
  name: String,
  email: String,
  password: String,
  status:String,
});

module.exports = mongoose.model('Users', user_schema);
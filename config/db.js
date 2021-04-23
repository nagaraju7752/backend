var config_env = require('../config/config');
var get_env_values_object = config_env.getEnvValues(process.env.ENVIRONMENT);

var mongoose = require('mongoose');
console.log('DB URL',get_env_values_object.MONGO_URL);
mongoose.connect(`${get_env_values_object.MONGO_URL}`,{ useNewUrlParser: true, useUnifiedTopology: true }).then((db)=>{

},(err)=>{
    console.log('Error in DBCONNECT',err);
});



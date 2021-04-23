function getEnvValues(env) {
    var result;

    switch (env) {

        case 'local':
            result = {
                "MONGO_URL": "mongodb://127.0.0.1:27017/crudapp",
                "MONGO_DB":"crudapp",
                'secret': 'ATHBKLOPCHKL',
                'session_timeout':900, //in 15minutes
                "SENDGRID_API_KEY":"", //API Key here
                "reset_url":"http://localhost:4200",
                "from_email":'', //from email
            };
            break;
        case 'dev':
            result = {
                "MONGO_URL": "mongodb://127.0.0.1:27017/crudapp",
                "MONGO_DB":"crudapp",
                'secret': 'ATHBKLOPCHKL',
                'session_timeout':900, //in 15minutes
                "SENDGRID_API_KEY":"",
                "reset_url":"http://localhost:4200",
                "from_email":'',
            };
            break;
        case 'QA':
            result = {
                "MONGO_URL": "mongodb://127.0.0.1:27017/crudapp",
                "MONGO_DB":"crudapp",
                'secret': 'supersecret',
                'session_timeout':900, //in 15minutes
                "SENDGRID_API_KEY":"",
                "reset_url":"http://localhost:4200",
                "from_email":'',
            };
            break;
            
        case 'cloud':
            result = {
                "MONGO_URL": "mongodb://127.0.0.1:27017/crudapp",
                "MONGO_DB":"crudapp",
                'secret': 'ATHBKLOPCHKL',
                'session_timeout':900, //in 15minutes
                "SENDGRID_API_KEY":"",
                "reset_url":"http://localhost:4200",
                "from_email":'',
            };
            break;
            

        default:
            result = {
                "MONGO_URL": "mongodb://127.0.0.1:27017/crudapp",
                "MONGO_DB":"crudapp",
                'secret': 'ATHBKLOPCHKL',
                'session_timeout':900, //in 15minutes
                "SENDGRID_API_KEY":"",
                "reset_url":"http://localhost:4200",
                "from_email":'',
            };
            break;

    }


    return result;


}

module.exports = { getEnvValues };

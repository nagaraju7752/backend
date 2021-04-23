var express = require('express');
var app = express();

require('dotenv').config();
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var cors = require('cors');
var db = require('./config/db');

app.use(bodyParser.json({ limit: '50mb', strict: false }));
app.use(cors());

/*
app.use(require('express-status-monitor')({
    title: 'Monitoring Metrics',
    path: '/status',
socketPath: '/securitymgr/socket.io',
}));
*/
//var mainCrypt = crypt.encrypt('123456');
//console.log(mainCrypt);

//app.use('/ReddisCopy', routes.ReddisCopy);
//app.use('/ReddisCopy/getFullGraph', routes.ReddisCopy);

app.set('view engine', 'ejs');
//app.set('views', path.join(__dirname,'./views'));

//app.use('/securitymgr/static', express.static('dist/public'));
//app.use('/securitymgr', express.static('dist'));

app.use(express.static('public'));
//app.use(express.static('./app/views/pages/'));
//app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use('/signup', routes.signup);
app.use('/Authentication', routes.login);

app.use('/employee',routes.employee);

app.listen(process.env.PORT, () =>
  console.log(`App listening on port ${process.env.PORT}`),
);

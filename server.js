var express = require('express');
var mysql = require('mysql');
var cors = require('cors');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var app = express();
var morgan = require('morgan');
var passport = require('passport');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var session = require('express-session');

require('./config/passport')(passport);
app.all('/*',function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
    //res.header("Access-Control-Allow-Headers", 'Content-Type');
    res.header("Access-Control-Allow-Headers", "'Content-type,Accept,X-Access-Token,X-Key");
    next();
});

app.use(morgan('dev'));
//app.use(bodyParser());
app.use(bodyParser.urlencoded({ 'extended': 'true' }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

app.use('/scripts', express.static(__dirname + '/node_modules/'));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride());
app.use(cookieParser());
app.use(session({ secret: 'testnodeapplication' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(cors());

var api = require('./config/routes.js')(app, passport);

app.use('/', api);

app.get('*', function (req, res) {
    res.sendfile('index.html');
});

app.listen(3000);

console.log('listening to port 3000');


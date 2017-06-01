const express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
//var cors = require('express-cors');
var cors = require('cors');
//var passport = require('passport'); 
//require('./passport')(passport);
var db = require('./userdb');
router.use(bodyParser.urlencoded({ 'extended': 'true' }));
router.use(bodyParser.json());
router.use(bodyParser.json({ type: 'application/vnd.api+json' }));
//router.use(cors({origin: 'http://localhost:3000'}));

module.exports = function (app) {

    router.all('*', function (req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
        res.setHeader("Access-Control-Allow-Headers", 'Content-Type');
        console.log('headers set');
        next();
    });

    router.use(cors({ origin: 'http://localhost:3000' }));

    router.get('/home', (req, res) => {
        res.send('api works');
    });

    return router;
};



//module.exports = router;
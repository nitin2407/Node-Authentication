const express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
//var passport = require('passport'); 
//require('./passport')(passport);
var db = require('./db');
router.use(bodyParser.urlencoded({'extended':'true'}));
router.use(bodyParser.json()); 
router.use(bodyParser.json({ type: 'application/vnd.api+json' }));

module.exports = function (app, passport) {
    
    
    router.get('/employee', isLoggedIn, (req, res) => {
        res.send('api works');
    });

    router.get('/error', (req, res) => {
        //res.writeHead(400, {'Content-Type': 'text/plain'});;
        //res.send('Error');
        //res.status(409);
        res.json({message: req.flash('ErrorMessage')});
    });

    router.get("/employee/:emp_id", isLoggedIn, (req, res) => {
        db.select_emp(req, res, req.params.emp_id);
    });

    router.post('/login', passport.authenticate('local-login', {
        successRedirect: '/employee', // redirect to the secure profile section
        failureRedirect: '/error', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    router.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/employee', // redirect to the secure profile section
        failureRedirect : '/error', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    /*router.post('/login', function (req, res) {
        console.log("body parsing", req.body);
    });*/

    return router;
};

//var db = require('./db');

//module.exports = function(app,passport){

//}

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}


//module.exports = router;
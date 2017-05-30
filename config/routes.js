const express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
//var passport = require('passport'); 
//require('./passport')(passport);
var db = require('./userdb');
router.use(bodyParser.urlencoded({ 'extended': 'true' }));
router.use(bodyParser.json());
router.use(bodyParser.json({ type: 'application/vnd.api+json' }));

module.exports = function (app, passport) {


    router.get('/employee', isLoggedIn, (req, res) => {
        res.send('api works');
    });
    router.get('/fbuser', (req, res) => {
        res.send('fb works');
    });

    router.get('/admin', isLoggedIn, isAdmin, (req, res) => {
        res.send('admin page');
    });

    router.get('/error', (req, res) => {
        //res.writeHead(400, {'Content-Type': 'text/plain'});;
        //res.send('Error');
        //res.status(409);
        res.json({ message: req.flash('ErrorMessage') });
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
        successRedirect: '/employee', // redirect to the secure profile section
        failureRedirect: '/error', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    /*router.post('/login', function (req, res) {
        console.log("body parsing", req.body);
    });*/

    router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }));

    // handle the callback after facebook has authenticated the user
    router.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/fbuser',
            failureRedirect: '/error'
        }));

    router.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    return router;
};

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

function isAdmin(req, res, next) {

    // if user is authenticated in the session, carry on
    console.log('checking for admin:' + req.user.email);
    db.get_roles(req.user.email, req, function (err, user) {
        if (!err) {
            console.log('got role as:' + user.role_id);
            if (user.role_id == 2) {
                return next();
            }
            else {
                console.log('not admin');
                res.redirect('/');
            }
        }
        else {
            res.redirect('/');
        }
    })
    // if not admin redirect them to the home page

}


//module.exports = router;
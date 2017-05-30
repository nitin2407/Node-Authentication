var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var pool = require('./ConnectionPool');
var db = require('./userdb');
var configAuth = require('./auth');

module.exports = function (passport) {

    passport.serializeUser(function (user, done) {
        console.log('in serializer');
        done(null, user.emp_id);
    });

    passport.deserializeUser(function (id, done) {

        console.log('in deserializer');
        pool.getConnection(function (err, connection) {
            if (err) {
                done(err, req.flash('ErrorMessage', 'Error in connection database.'));
            }

            console.log('connected as id ' + connection.threadId);

            connection.query("select * from emp where emp_id = ?", id, function (err, rows) {
                connection.release();
                if (!err) {
                    done(err, rows[0]);
                    console.log(rows);
                }
            });

            connection.on('error', function (err) {
                done(err, req.flash('ErrorMessage', 'Error in connection database.'));
            });
        });
    });

    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
        function (req, email, password, done) {

            console.log('into local-login' + email + password);


            db.login(email, password, req, function (err, user) {
                if (err) {
                    return done(err);
                }
                else {
                    return done(null, user);
                }
            });
            /*pool.getConnection(function (err, connection) {
                if (err) {
                    return done(null, false, req.flash('ErrorMessage', 'Error in connection database.'));
                }

                console.log('connected as id ' + connection.threadId);

                connection.query("select * from emp where email = ?", email, function (err, rows) {
                    connection.release();
                    if (!err) {
                        if (!rows.length) {
                            return done(null, false, req.flash('ErrorMessage', 'No user found.'));
                        }
                        if (!(rows[0].password == password))
                            return done(null, false, req.flash('ErrorMessage', 'Oops! Wrong password.'));

                        return done(null, rows[0]);
                    }
                });

                connection.on('error', function (err) {
                    return done(null, false, req.flash('ErrorMessage', 'Error in connection database.'));
                });
            });*/

        }));

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },
        function (req, email, password, done) {

            console.log('into local-signup' + email + password);

            var user={
                email: email,
                password: password,
                fname: req.body.fname,
                lname: req.body.lname
            }

            console.log(user);

            db.register(user, req, function (err, result) {
                if (err) {
                    return done(err);
                }
                else {
                    db.find_emp(email, req, function (err, user) {
                        if (err) {
                            return done(err);
                        }
                        else {
                            return done(null, user);
                        }
                    })

                }
            });

            /*pool.getConnection(function (err, connection) {
                if (err) {
                    return done(null, false, req.flash('ErrorMessage', 'Error in connection database.'));
                }

                connection.query("Insert into emp values(null,?,?,?,?)", [email,password,req.body.fname,req.body.lname], function (err, result) {
                    connection.release();
                    if (!err) {
                        if(result<=0){
                            return done(null, false, req.flash('ErrorMessage', 'Record alrady exists.'));
                        }
                        var user = {
                            email: email,
                            password: password
                        }
                        return done(null, user);
                    }
                });

                connection.on('error', function (err) {
                    return done(null, false, req.flash('ErrorMessage', 'Error in connection database.'));
                });
            });*/

        }));

    passport.use(new FacebookStrategy({

        // pull in our app id and secret from our auth.js file
        clientID: configAuth.facebookAuth.clientID,
        clientSecret: configAuth.facebookAuth.clientSecret,
        callbackURL: configAuth.facebookAuth.callbackURL,
        profileFields: ['id', 'email', 'displayName', 'first_name', 'last_name'],
        passReqToCallback: true
    },

        // facebook will send back the token and profile
        function (req, token, refreshToken, profile, done) {

            //console.log("profile id found as: " + profile.id);
            //console.log("profile id found as: " + profile.name.givenName);
            console.log("profile email found as: " + profile.emails[0].value);

            db.findFacebookUser(profile.id, req, function (err, user) {

                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);
                console.log("no error");
                // if the user is found, then log them in
                if (user) {
                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user found with that facebook id, create them
                    console.log("no user found");
                    var user = {
                        id: profile.id,
                        token: token,
                        fname: profile.name.givenName,
                        lname: profile.name.familyName,
                        email: profile.emails[0].value
                    }
                    console.log("found user details: " + profile.id);
                    console.log("found user details: " + profile.name.givenName);
                    db.registerFacebookUser(user, req, function (err, result) {
                        if (err) {
                            return done(err);
                        }
                        else {
                            db.find_emp(user.email, req, function (err, mainuser) {
                                if (err) {
                                    return done(err);
                                }
                                else {
                                    return done(null, mainuser);
                                }
                            })
                        }
                    });
                }

            });
        }));

};
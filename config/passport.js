var LocalStrategy = require('passport-local').Strategy;
var pool = require('./ConnectionPool');
var db = require('./userdb');

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


            db.login(email, password, req, function(err,user){
                if(err){
                    return done(err);
                }
                else{
                    return done(null,user);
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

             db.register(email,password, req, function(err,result){
                if(err){
                    return done(err);
                }
                else{
                    db.find_emp(email,req,function(err,user){
                        if(err){
                            return done(err);
                        }
                        else{
                            return done(null,user);
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

};
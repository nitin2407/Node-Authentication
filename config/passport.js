var LocalStrategy   = require('passport-local').Strategy;
var pool = require('./ConnectionPool');

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
		console.log('in serializer');
        done(null, user.emp_id);
    });

    passport.deserializeUser(function(id, done) {
        
        console.log('in deserializer');
        pool.getConnection(function (err, connection) {
            if (err) {
                done(err, req.flash('connectionError', 'Error in connection database.'));
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
                done(err,req.flash('connectionError', 'Error in connection database.'));
            });
        });
    });

    passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {

        console.log('into local-login' + email + password);

        pool.getConnection(function (err, connection) {
            if (err) {
                return done(null, false, req.flash('connectionError', 'Error in connection database.'));
            }

            console.log('connected as id ' + connection.threadId);

            connection.query("select * from emp where email = ?",email, function (err, rows) {
                connection.release();
                if (!err) {
                    if(!rows.length){
                        return done(null, false,  req.flash('loginMessage', 'No user found.'));
                    }
                     if (!( rows[0].password == password))
                        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));

                    return done(null, rows[0]);
                }
            });

            connection.on('error', function (err) {
                return done(null,false,req.flash('connectionError', 'Error in connection database.'));
            });
        });

    }));
};
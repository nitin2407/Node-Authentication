var mysql = require('mysql');

var pool = require('./ConnectionPool');
var bcrypt = require('bcrypt-nodejs');

function select_emp(req, res, data) {

    var emp_id = data;

    pool.getConnection(function (err, connection) {
        if (err) {
            res.json({ "code": 100, "status": "Error in connection database" });
            return;
        }

        console.log('connected as id ' + connection.threadId);

        connection.query("select * from p_mstr_employee where emp_id = ?", emp_id, function (err, rows) {
            connection.release();
            if (!err) {
                res.json(rows);
                console.log(rows);
            }
        });

        connection.on('error', function (err) {
            res.status(400);
            res.json({ "code": 100, "status": "Error in connection database" });
            return;
        });
    });
}

/*function login(req, res, data){
    var username = data.username;
    var pass = data.password;

    pool.getConnection(function (err, connection) {
        if (err) {
            res.status(400);
            res.json({ "code": 100, "status": "Error in connection database" });
            return;
        }

        console.log('connected as id ' + connection.threadId);

        connection.query("select * from p_mstr_employee where emp_id = ?",emp_id, function (err, rows) {
            connection.release();
            if (!err) {
                res.json(rows);
                console.log(rows);
            }
        });

        connection.on('error', function (err) {
            res.status(400);
            res.json({ "code": 100, "status": "Error in connection database" });
            return;
        });
    });

}*/


function login(email, password, req, done) {

    pool.getConnection(function (err, connection) {
        if (err) {
            return done(err, req.flash('ErrorMessage', 'Error in connection database.'));
        }

        console.log('connected as id ' + connection.threadId);

        connection.query("select * from emp where email = ?", email, function (err, rows) {
            connection.release();
            if (!err) {
                if (!rows.length) {
                    return done(err, req.flash('ErrorMessage', 'No user found.'));
                }
                console.log(rows[0].password);
                if (!bcrypt.compareSync(password, rows[0].password))
                    return done(err, req.flash('ErrorMessage', 'Oops! Wrong password.'));

                return done(null, rows[0]);
            }
        });

        connection.on('error', function (err) {
            return done(err, req.flash('ErrorMessage', 'Error in connection database.'));
        });
    });

    /*pool.getConnection(function (err, connection) {
        if (err) {
            res.json({ "code": 100, "status": "Error in connection database" });
            return;
        }

        console.log('connected as id ' + connection.threadId);

        connection.query("select * from p_mstr_employee where emp_id = ?",emp_id, function (err, rows) {
            connection.release();
            if (!err) {
                //res.json(rows);
                //console.log(rows);
            }
        });

        connection.on('error', function (err) {
            res.status(400);
            res.json({ "code": 100, "status": "Error in connection database" });
            return;
        });
    });*/
}

function find_emp(email, req, done) {

    pool.getConnection(function (err, connection) {
        if (err) {
            return done(err, req.flash('ErrorMessage', 'Error in connection database.'));
        }

        console.log('connected as id ' + connection.threadId);

        connection.query("select * from emp where email = ?", email, function (err, rows) {
            connection.release();
            if (!err) {
                if (!rows.length) {
                    return done(err, req.flash('ErrorMessage', 'No user found.'));
                }
                return done(null, rows[0]);
            }
        });

        connection.on('error', function (err) {
            return done(err, req.flash('ErrorMessage', 'Error in connection database.'));
        });
    });

}


function register(user, req, done) {

    pool.getConnection(function (err, connection) {
        if (err) {
            return done(err, req.flash('ErrorMessage', 'Error in connection database.'));
        }

        console.log('connected as id ' + connection.threadId);

        var hashpassword = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8), null);

        connection.query("Insert into emp values(null,?,?,?,?,?)", [user.email, hashpassword, user.fname, user.lname, 1], function (err, result) {
            console.log('User creation query completed');
            connection.release();
            if(err.code == 'ER_DUP_ENTRY'){
                console.log(err.code);
                return done(err, req.flash('ErrorMessage', 'User already exists'));
            }
            
            if(err){
                console.log(err.name);
                return done(err, req.flash('ErrorMessage', 'User already exists'));
            }
            
            if (!err) {
                /*if (result <= 0) {
                    console.log('User already exists-not able to create new');
                    return done(err, req.flash('ErrorMessage', 'User already exists'));
                }*/
                return done(null, result);
            }
        });

        connection.on('error', function (err) {
            return done(err, req.flash('ErrorMessage', 'Error in connection database.'));
        });
    });

}


function get_roles(email, req, done) {

    pool.getConnection(function (err, connection) {
        if (err) {
            return done(err);
        }

        console.log('connected as id ' + connection.threadId);

        connection.query("select role_id from emp where email = ?", email, function (err, rows) {
            connection.release();
            if (!err) {
                if (!rows.length) {
                    return done(err);
                }
                return done(null, rows[0]);
            }
        });

        connection.on('error', function (err) {
            return done(err);
        });
    });

}

function findFacebookUser(id, req, done) {

    pool.getConnection(function (err, connection) {
        if (err) {
            return done(err);
        }

        console.log('connected as id ' + connection.threadId);

        connection.query("select * from facebook_user where id = ?", id, function (err, rows) {
            connection.release();
            if (!err) {
                if (!rows.length) {
                    console.log("no rows found");
                    return done(null);
                }
                findEmpById(rows[0].user_id, req, function (err, user) {
                    if (err) {
                        return done(err);
                    }
                    else {
                        return done(null, user);
                    }
                });
            }
        });

        connection.on('error', function (err) {
            return done(err);
        });
    });

}

function registerFacebookUser(user, req, done) {

    //console.log("inside fb registeer module");
    user.password = 'fbuser_' + user.id;
    register(user, req, function (err, result) {
        if (err && err.code!='ER_DUP_ENTRY') {
            //console.log(req.flash('ErrorMessage'));
            console.log(err.code);
            return done(err);
        }
        /*else if (err){
            console.log(err);
            return done(err);
        }*/
        else {
            find_emp(user.email, req, function (err, mainuser) {
                if (err) {
                    return done(err);
                }
                else {
                    pool.getConnection(function (err, connection) {
                        if (err) {
                            return done(err);
                        }

                        console.log('connected as id ' + connection.threadId);
                        console.log(user);


                        connection.query("Insert into facebook_user values(?,?,?,?,?,?)", [user.id, user.email, user.fname, user.lname, user.token, mainuser.emp_id], function (err, result) {
                            connection.release();
                            if (!err) {
                                if (result <= 0) {
                                    //console.log("unable to insert into facebook table");
                                    return done(err);
                                }
                                console.log("data inserted into facebook table");
                                return done(null, result);
                            }
                            console.log("unable to insert into facebook table");
                        });

                        connection.on('error', function (err) {
                            return done(err);
                        });
                    });
                }
            });
        }
    });

}

function findEmpById(id, req, done) {

    pool.getConnection(function (err, connection) {
        if (err) {
            return done(err, req.flash('ErrorMessage', 'Error in connection database.'));
        }

        console.log('connected as id ' + connection.threadId);

        connection.query("select * from emp where emp_id = ?", id, function (err, rows) {
            connection.release();
            if (!err) {
                if (!rows.length) {
                    return done(err, req.flash('ErrorMessage', 'No user found.'));
                }
                return done(null, rows[0]);
            }
        });

        connection.on('error', function (err) {
            return done(err, req.flash('ErrorMessage', 'Error in connection database.'));
        });
    });

}



module.exports = {
    select_emp,
    login,
    find_emp,
    register,
    get_roles,
    findFacebookUser,
    registerFacebookUser,
    findEmpById
}

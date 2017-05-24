var mysql = require('mysql');

var pool = require('./ConnectionPool');

function select_emp(req, res, data) {

    var emp_id = data;
    
    pool.getConnection(function (err, connection) {
        if (err) {
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
}

function login(req, res, data){
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

}

module.exports = {
    select_emp,
    login
}

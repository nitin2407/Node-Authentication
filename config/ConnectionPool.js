var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit: 100, //important
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'myDb',
    debug: false
});


module.exports = pool;

const mysql = require('mysql2');

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'mysqlpassword',
      database: 'employee_management_system'
    },
    console.log(`Connected to the employee_management_system database.`)
);

module.exports = db;
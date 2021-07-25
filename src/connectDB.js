const mysql = require('mysql2');

const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: 'mysqlpassword',
      database: 'employee_management_system'
    },
    console.log(`Connected to the employee_management_system database.`)
);

module.exports = db;

  
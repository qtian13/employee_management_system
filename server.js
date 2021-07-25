// Import and inquirer mysql2
const inquirer = require('inquirer');
// Import and require mysql2
const mysql = require('mysql2');
const { throwError } = require('rxjs');

// Connect to database
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

// Query database
db.query('SELECT * FROM department', function (err, results) {
  if (err) throw err;

  Object.keys(results).forEach(key => {
      let row = results[key];
      console.log(row.id);
      console.log(row.name);
  })
});
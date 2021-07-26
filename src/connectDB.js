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

const dbQuery = (tableName, column, value) => {
    db.promise().query(`SELECT * FROM ${tableName} WHERE ${column} = ${value}`)
        .then((results) => console.log(results[0]))
        .catch(console.log());
};

module.exports = {
    db,
    dbQuery
};
const db = require('./connectDB');

const sqlDisplayEmployee = `SELECT a.id, a.first_name, a.last_name, role.title, CONCAT_WS(' ', b.first_name, b.last_name) AS 'manager', role.salary, department.name AS department
                            FROM employee a
                            LEFT JOIN role
                            ON a.role_id = role.id
                            LEFT JOIN employee b
                            ON a.manager_id = b.id
                            LEFT JOIN department
                            ON role.department_id = department.id`;

const sqlDisplayRole = `SELECT role.id, title, salary, department.name AS department 
                        FROM role
                        LEFT JOIN department
                        ON role.department_id = department.id`;

const sqlDisplayDepartment = `SELECT * FROM department`;

const sqlAddDepartment = `INSERT INTO department (name) VALUES (?)`;

                    
const getEmployee = () => db.promise().query(sqlDisplayEmployee)
                            .then(results => results[0])
                            .catch(err => console.log(err));

const getRole = () => db.promise().query(sqlDisplayRole)
                            .then(results => results[0])
                            .catch(err => console.log(err));                                
                            
const getDepartments = () => db.promise().query(sqlDisplayDepartment)
                                .then(results => results[0])
                                .catch(err => console.log(err));

const addDepartment = (name) => db.promise().query(sqlAddDepartment, [name])
                                    .catch(err => console.log(err));

module.exports = {
    getEmployee,
    getRole,
    getDepartments,
    addDepartment,
};
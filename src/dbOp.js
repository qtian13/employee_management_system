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

const sqlGetManagers = `SELECT employee.id, CONCAT_WS(' ', first_name, last_name) AS 'manager_name', role.title, department.name AS department 
                        FROM employee
                        LEFT JOIN role
                        ON employee.role_id = role.id
                        LEFT JOIN department
                        ON role.department_id = department.id
                        WHERE role.title = 'manager'`;

const sqlAddDepartment = `INSERT INTO department (name) VALUES (?)`;

                    
const getEmployees = () => db.promise().query(sqlDisplayEmployee)
                            .then(results => results[0])
                            .catch(err => console.log(err));

const getEmployeesByDepartment = (departmentId) => {
    const sql = sqlDisplayEmployee + ' WHERE role.department_id = ?';
    return db.promise().query(sql, [departmentId])
                .then(results => results[0])
                .catch(err => console.log(err));
};

const getEmployeesByManager = (managerId) => {
    const sql = sqlDisplayEmployee + ' WHERE a.manager_id = ?';
    return db.promise().query(sql, [managerId])
                .then(results => results[0])
                .catch(err => console.log(err));
};

const getManagers = () => db.promise().query(sqlGetManagers)
                            .then(results => results[0])
                            .catch(err => console.log(err));

const getRoles = () => db.promise().query(sqlDisplayRole)
                            .then(results => results[0])
                            .catch(err => console.log(err));                                
                            
const getDepartments = () => db.promise().query(sqlDisplayDepartment)
                                .then(results => results[0])
                                .catch(err => console.log(err));

const addEmployee = (firstName, lastName, roleId, managerId) => {
    const params = [firstName, lastName, roleId, managerId];
    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);`
    return db.promise().query(sql, params);
}

const updateEmployeeRole = (roleId, employeeId) => {
    const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
    const params = [roleId, employeeId];
    return db.promise().query(sql, params);
}

const updateEmployeeManager = (managerId, employeeId) => {
    const sql = `UPDATE employee SET manager_id = ? WHERE id = ?`;
    const params = [managerId, employeeId];
    return db.promise().query(sql, params);
}

const removeEmployee = (employeeId) => {
    const sql = `DELETE FROM employee WHERE id = ?`;
    const params = [employeeId];
    return db.promise().query(sql, params);
}

const removeRole = (roleId) => {
    const sql = `DELETE FROM role WHERE id = ?`;
    const params = [roleId];
    return db.promise().query(sql, params);
}

const removeDepartment = (departmentId) => {
    const sql = `DELETE FROM department WHERE id = ?`;
    const params = [departmentId];
    return db.promise().query(sql, params);
}

const addRole = (title, salary, department_id) => {
    const params = [title, salary, department_id];
    const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?);`;
    return db.promise().query(sql, params);
}

const addDepartment = (name) => db.promise().query(sqlAddDepartment, [name]);

const getTotalUtilizedBudgetByDepartment = () => {
    const sql = `SELECT department.name AS department, SUM(salary) AS total_budget 
                 FROM employee 
                 LEFT JOIN role 
                 ON employee.role_id = role.id
                 LEFT JOIN department 
                 ON role.department_id = department.id
                 GROUP BY department_id`;
    return db.promise().query(sql)
            .then(results => results[0])
            .catch(err => console.log(err));

}

module.exports = {
    getEmployees,
    getEmployeesByDepartment,
    getEmployeesByManager,
    getManagers,
    getRoles,
    getDepartments,
    addEmployee,
    addRole,
    addDepartment,
    updateEmployeeRole,
    updateEmployeeManager,
    removeEmployee,
    removeRole,
    removeDepartment,
    getTotalUtilizedBudgetByDepartment
};
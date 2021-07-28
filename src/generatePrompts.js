
const inquirer = require('inquirer');
const cTable = require('console.table');

const db = require('./connectDB');
const { getEmployee, getRole, getDepartments, addDepartment } = require('./dbOp');
const { questionsMenu, questionsToAddRecord, generateQuestionsToAddRole, generateQuestionToAddDepartment, questionsToReadRecord, questionsToUpdateRecord, questionsToRemoveRecord} = require('../helpers/questions');
const { throwError } = require('rxjs');

const promptQuestions = () => {
    inquirer
        .prompt(questionsMenu)
        .then((answer) => {
            const sqlDisplayEmployee = `SELECT a.id, a.first_name, a.last_name, role.title, CONCAT_WS(' ', b.first_name, b.last_name) AS 'manager', role.salary, department.name AS department
                                        FROM employee a
                                        LEFT JOIN role
                                        ON a.role_id = role.id
                                        LEFT JOIN employee b
                                        ON a.manager_id = b.id
                                        LEFT JOIN department
                                        ON role.department_id = department.id`;
            switch (answer.todo) {
                case 'View All Employees': {
                    getEmployee()
                        .then(results => {
                            console.table(results);
                            promptQuestions();
                        })
                        .catch(err => console.log(err));
                    return;
                }
                case 'View All Employees By Department': {
                    inquirer.prompt(questionsToReadRecord('employee', 'department'))
                        .then(answer => {
                            const sql = sqlDisplayEmployee + ` WHERE role.department_id = ?`;
                            return db.promise().query(sql, [answer.department_id]);
                        })
                        .then(results => {
                            console.table(results[0]);
                            promptQuestions();
                        })
                        .catch(err => console.log(err));
                    return;
                }
                case 'View All Employees By Manager': {
                    inquirer.prompt(questionsToReadRecord('employee', 'manager'))
                        .then(answer => {
                            const sql = sqlDisplayEmployee + ` WHERE a.manager_id = ?`;
                            return db.promise().query(sql, [answer.manager_id]);
                        })
                        .then(results => {
                            console.table(results[0]);
                            promptQuestions();
                        })
                        .catch(err => console.log(err));
                    return;
                }
                case 'Add An Employee': {
                    questionsToAddRecord('employee')
                        .then(questions => inquirer.prompt(questions))
                        .then(answer => {
                            const { first_name, last_name, role_id, manager_id } = answer;
                            const params = [first_name, last_name, role_id, manager_id];
                            const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                         VALUES (?, ?, ?, ?);`;
                            return db.promise().query(sql, params);
                        })
                        .then(() => promptQuestions())
                        .catch(err => console.log(err));
                    return;
                }
                case 'Remove An Employee': {
                    inquirer.prompt(questionsToRemoveRecord('employee'))
                        .then(answer => {
                            const { id } = answer;
                            const params = [id];
                            const sql = `DELETE FROM employee
                                         WHERE id = ?;`;
                            return db.promise().query(sql, params);
                        })
                        .then(() => promptQuestions())
                        .catch(err => console.log(err));
                    return;
                }
                case 'Update An Employee Role': {
                    inquirer.prompt(questionsToUpdateRecord('employee', 'role'))
                        .then(answer => {
                            const { id, role_id } = answer;
                            const params = [role_id, id];
                            const sql = `UPDATE employee
                                         SET role_id = ?
                                         WHERE id = ?;`
                            return db.promise().query(sql, params);
                        })
                        .then(() => promptQuestions())
                        .catch(err => console.log(err));
                    return;
                }
                case 'Update An Employee Manager': {
                    inquirer.prompt(questionsToUpdateRecord('employee', 'manager'))
                        .then(answer => {
                            const { id, manager_id } = answer;
                            const params = [manager_id, id];
                            const sql = `UPDATE employee
                                         SET manager_id = ?
                                         WHERE id = ?;`;
                            return db.promise().query(sql, params);
                        })
                        .then(() => promptQuestions())
                        .catch(err => console.log(err));
                    return;
                }
                case 'View All Roles': {
                    getRole()
                        .then(results => {
                            console.table(results);
                            promptQuestions();
                        })
                        .catch(err => console.log(err));
                    return;
                }
                case 'Add A Role': {
                    generateQuestionsToAddRole()
                        .then(questions => inquirer.prompt(questions))
                        .then(answer => {
                            const { title, salary, department_id } = answer;
                            const params = [title, salary, department_id];
                            const sql = `INSERT INTO role (title, salary, department_id)
                            VALUES (?, ?, ?);`;
                            return db.promise().query(sql, params);
                        })
                        .then(() => promptQuestions())
                        .catch(err => console.error(err));
                    return;
                    // questionsToAddRecord('role')
                    //     .then(questions => inquirer.prompt(questions))
                    //     .then(answer => {
                    //         const { title, salary, department_id } = answer;
                    //         const params = [title, salary, department_id];
                    //         const sql = `INSERT INTO role (title, salary, department_id)
                    //         VALUES (?, ?, ?);`;
                    //         return db.promise().query(sql, params);
                    //     })
                    //     .then(() => promptQuestions())
                    //     .catch(err => console.error(err));
                    // return;
                }
                case 'Remove A Role': {
                    inquirer.prompt(questionsToRemoveRecord('role'))
                        .then(answer => {
                            const { id } = answer;
                            const params = [id];
                            const sql = `DELETE FROM role
                                         WHERE id = ?;`;
                            return db.promise().query(sql, params);
                        })
                        .then(() => promptQuestions())
                        .catch(err => console.log(err));
                    return;
                }
                case 'View All Departments': {
                    getDepartments()
                        .then(results => {
                            console.table(results);
                            promptQuestions();
                        })
                        .catch(err => console.log(err));
                    return;
                }
                case 'Add A Department': {
                    inquirer.prompt(generateQuestionToAddDepartment())
                        .then(answer => addDepartment(answer.name))
                        .catch(err => console.log(err))
                        .then(() => promptQuestions())
                        .catch(err => console.log(err));
                    return;
                }
                case 'Remove A Department': {
                    inquirer.prompt(questionsToRemoveRecord('department'))
                        .then(answer => {
                            const { id } = answer;
                            const params = [id];
                            const sql = `DELETE FROM department
                                         WHERE id = ?;`;
                            return db.promise().query(sql, params);
                        })
                        .then(() => promptQuestions())
                        .catch(err => console.log(err));
                    return;
                }
                case 'View Total Utilized Budget By Department' : {
                    const sql = `SELECT department.name AS department, SUM(salary) AS total_budget 
                                 FROM employee 
                                 LEFT JOIN role 
                                 ON employee.role_id = role.id
                                 LEFT JOIN department 
                                 ON role.department_id = department.id
                                 GROUP BY department_id`;
                    db.promise().query(sql)
                        .then(results => {
                            console.table(results[0]);
                            promptQuestions();
                        })
                        .catch(err => console.log(err));
                    return;
                }
                case 'Quit': {
                    return console.log("Thanks for using! Bye!");
                }
                default:
                    return console.log('Sorry, no idea how to do it');
            }
        })
};

module.exports = promptQuestions;
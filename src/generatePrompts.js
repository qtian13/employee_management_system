
const inquirer = require('inquirer');
const cTable = require('console.table');

const { db } = require('./connectDB');
const { questionsMenu, questionsToAddRecord, questionsToReadRecord, questionsToUpdateRecord, questionsToRemoveRecord} = require('../helpers/questions');
const { throwError } = require('rxjs');

const promptQuestions = () => {
    inquirer
        .prompt(questionsMenu)
        .then((answer) => {
            switch (answer.todo) {
                case 'View All Employees': {
                    const sql = `SELECT id, CONCAT_WS(' ', employee.first_name, employee.last_name) AS name, role_id, manager_id FROM employee`;
                    db.promise().query(sql)
                        .then(results => {
                            console.table(results[0]);
                            promptQuestions();
                        })
                        .catch(err => console.log(err));
                    return;
                }
                case 'View All Employees By Department': {
                    inquirer.prompt(questionsToReadRecord('employee', 'department'))
                        .then(answer => {
                            const sql = `SELECT employee.id, CONCAT_WS(' ', employee.first_name, employee.last_name) AS name, employee.role_id, employee.manager_id  
                                         FROM employee
                                         LEFT JOIN role
                                         ON employee.role_id = role.id
                                         WHERE role.department_id = ${answer.department_id}`;
                            return db.promise().query(sql);
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
                            const sql = `SELECT id, CONCAT_WS(' ', employee.first_name, employee.last_name) AS name, role_id, manager_id FROM employee 
                                         WHERE manager_id = ${answer.manager_id}`
                            return db.promise().query(sql);
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
                            const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                         VALUES ("${first_name}", "${last_name}", ${role_id}, ${manager_id});`;
                            return db.promise().query(sql);
                        })
                        .then(() => promptQuestions())
                        .catch(err => console.log(err));
                    return;
                }
                case 'Remove An Employee': {
                    inquirer.prompt(questionsToRemoveRecord('employee'))
                        .then(answer => {
                            const { id } = answer;
                            const sql = `DELETE FROM employee
                                         WHERE id = ${id};`;
                            return db.promise().query(sql);
                        })
                        .then(() => promptQuestions())
                        .catch(err => console.log(err));
                    return;
                }
                case 'Update An Employee Role': {
                    inquirer.prompt(questionsToUpdateRecord('employee', 'role'))
                        .then(answer => {
                            const { id, role_id } = answer;
                            const sql = `UPDATE employee
                                         SET role_id = ${role_id}
                                         WHERE id = ${id};`
                            return db.promise().query(sql);
                        })
                        .then(() => promptQuestions())
                        .catch(err => console.log(err));
                    return;
                }
                case 'Update An Employee Manager': {
                    inquirer.prompt(questionsToUpdateRecord('employee', 'manager'))
                        .then(answer => {
                            const { id, manager_id } = answer;
                            const sql = `UPDATE employee
                                         SET manager_id = ${manager_id}
                                         WHERE id = ${id};`;
                            return db.promise().query(sql);
                        })
                        .then(() => promptQuestions())
                        .catch(err => console.log(err));
                    return;
                }
                case 'View All Roles': {
                    const sql = `SELECT * FROM role`;
                    db.promise().query(sql)
                        .then(results => {
                            console.table(results[0]);
                            promptQuestions();
                        })
                        .catch(err => console.log(err));
                    return;
                }
                case 'Add A Role': {
                    questionsToAddRecord('role')
                        .then(questions => inquirer.prompt(questions))
                        .then(answer => {
                            const { title, salary, department_id} = answer;
                            const sql = `INSERT INTO role (title, salary, department_id)
                            VALUES ("${title}", ${salary}, ${department_id});`;
                            return db.promise().query(sql);
                        })
                        .then(() => promptQuestions())
                        .catch(err => console.error(err));
                    return;
                }
                case 'Remove A Role': {
                    inquirer.prompt(questionsToRemoveRecord('role'))
                        .then(answer => {
                            const { id } = answer;
                            const sql = `DELETE FROM role
                                         WHERE id = ${id};`;
                            return db.promise().query(sql);
                        })
                        .then(() => promptQuestions())
                        .catch(err => console.log(err));
                    return;
                }
                case 'View All Departments': {
                    const sql = `SELECT * FROM department`;
                    db.promise().query(sql)
                        .then(results => {
                            console.table(results[0]);
                            promptQuestions();
                        })
                        .catch(err => console.log(err));
                    return;
                }
                case 'Add A Department': {
                    questionsToAddRecord('department')
                        .then(questions => inquirer.prompt(questions))
                        .then(answer => {
                            const { name } = answer;
                            const sql = `INSERT INTO department (name)
                                         VALUES ("${name}");`;
                            return db.promise().query(sql);
                        })
                        .then(() => promptQuestions())
                        .catch(err => console.log(err));
                    return;
                }
                case 'Remove A Department': {
                    inquirer.prompt(questionsToRemoveRecord('department'))
                        .then(answer => {
                            const { id } = answer;
                            const sql = `DELETE FROM department
                                         WHERE id = ${id};`;
                            return db.promise().query(sql);
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
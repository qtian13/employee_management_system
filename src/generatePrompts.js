
const inquirer = require('inquirer');
const { displayTable } = require('./display');
const { db } = require('./connectDB');
const { questionsMenu, questionsToAddRecord, questionsToReadRecord, questionsToUpdateRecord, questionsToRemoveRecord} = require('../helpers/questions');
const { throwError } = require('rxjs');

const promptQuestions = () => {
    inquirer
        .prompt(questionsMenu)
        .then((answer) => {
            switch (answer.todo) {
                case 'View All Employees':
                    db.promise().query(`SELECT * FROM employee`)
                        .then((results) => displayTable('employee', results[0]))
                        .then(() => promptQuestions());
                    return;
                case 'View All Employees By Department':
                    inquirer.prompt(questionsToReadRecord('employee', 'department'))
                        .then(answer => db.promise().query(`SELECT * FROM 
                                employee a
                                LEFT JOIN role b
                                ON a.role_id = b.id
                                WHERE b.department_id = ${answer.department_id}`))
                        .then((results) => displayTable('employee', results[0]))
                        .then(() => promptQuestions());
                    return;
                case 'View All Employees By Manager':
                    inquirer.prompt(questionsToReadRecord('employee', 'manager'))
                        .then(answer => db.promise().query(`SELECT * FROM employee 
                                    WHERE manager_id = ${answer.manager_id}`))
                        .then((results) => displayTable('employee', results[0]))
                        .then(() => promptQuestions());
                    return;
                case 'Add An Employee': 
                    questionsToAddRecord('employee')
                        .then(questions => inquirer.prompt(questions))
                        .then(answer => {
                            const { first_name, last_name, role_id, manager_id } = answer;
                            return db.promise().query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                                VALUES ("${first_name}", "${last_name}", ${role_id}, ${manager_id});`)
                        })
                        .then(() => promptQuestions())
                        .catch(err => console.error(err));
                    return;
                case 'Remove An Employee': 
                    inquirer.prompt(questionsToRemoveRecord('employee'))
                        .then(answer => {
                            const { id } = answer;
                            return db.promise().query(`DELETE FROM employee
                                                WHERE id = ${id};`)
                        })
                        .then(() => promptQuestions())
                        .catch(err => console.error(err));
                    return;
                case 'Update An Employee Role':
                    inquirer.prompt(questionsToUpdateRecord('employee', 'role'))
                        .then(answer => {
                            const { id, role_id } = answer;
                            return db.promise().query(`UPDATE employee
                                                        SET role_id = ${role_id}
                                                        WHERE id = ${id};`)
                        })
                        .then(() => promptQuestions())
                        .catch(err => console.error(err));
                    return;
                case 'Update An Employee Manager':
                    inquirer.prompt(questionsToUpdateRecord('employee', 'manager'))
                        .then(answer => {
                            const { id, manager_id } = answer;
                            return db.promise().query(`UPDATE employee
                                                        SET manager_id = ${manager_id}
                                                        WHERE id = ${id};`)
                        })
                        .then(() => promptQuestions())
                        .catch(err => console.error(err));
                    return;
                case 'View All Roles':
                    db.promise().query(`SELECT * FROM role`)
                        .then((results) => displayTable('role', results[0]))
                        .then(() => promptQuestions());
                    return;
                case 'Add A Role':
                    questionsToAddRecord('role')
                        .then(questions => inquirer.prompt(questions))
                        .then(answer => {
                            const { title, salary, department_id} = answer;
                            return db.promise().query(`INSERT INTO role (title, salary, department_id)
                                                VALUES ("${title}", ${salary}, ${department_id});`)
                        })
                        .then(() => promptQuestions())
                        .catch(err => console.error(err));
                    return;
                case 'Remove A Role': 
                    inquirer.prompt(questionsToRemoveRecord('role'))
                        .then(answer => {
                            const { id } = answer;
                            return db.promise().query(`DELETE FROM role
                                                WHERE id = ${id};`)
                        })
                        .then(() => promptQuestions())
                        .catch(err => console.error(err));
                    return;
                case 'View All Departments':
                    db.promise().query(`SELECT * FROM department`)
                            .then((results) => displayTable('department', results[0]))
                            .then(() => promptQuestions());
                    return;
                case 'Add A Department':
                    questionsToAddRecord('department')
                        .then(questions => inquirer.prompt(questions))
                        .then(answer => {
                            const { name } = answer;
                            return db.promise().query(`INSERT INTO department (name)
                                                VALUES ("${name}");`)
                        })
                        .then(() => promptQuestions())
                        .catch(err => console.error(err));
                    return;
                case 'Remove A Department': 
                    inquirer.prompt(questionsToRemoveRecord('department'))
                        .then(answer => {
                            const { id } = answer;
                            return db.promise().query(`DELETE FROM department
                                                WHERE id = ${id};`)
                        })
                        .then(() => promptQuestions())
                        .catch(err => console.error(err));
                    return;
                case 'Quit':
                    console.log("Thanks for using! Bye!")
                    return;
                default:
                    console.log('Sorry, no idea how to do it');
                    return;
            }
        })
};

module.exports = promptQuestions;
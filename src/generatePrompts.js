
const inquirer = require('inquirer');
const { displayTable } = require('./display');
const { db } = require('./connectDB');
const { questionsToAddRecord, questionsMenu } = require('../helpers/questions');
const { throwError } = require('rxjs');

const promptQuestions = () => {
    inquirer
        .prompt([questionsMenu])
        .then((answer) => {
            switch (answer.todo) {
                case 'View All Employees':
                    db.promise().query(`SELECT * FROM employee`)
                        .then((results) => displayTable('employee', results[0]))
                        .then(() => promptQuestions());
                    return;
                case 'View All Employees By Department':
                    inquirer.prompt([
                        {
                            type: "input",
                            message: "Please enter the department ID",
                            name: 'departmentID',
                            validate(value) {
                                const valid =  !isNaN(parseInt(value));
                                return valid || 'Please enter a valid ID';
                            },
                        }
                    ]).then(answer => {
                        db.promise().query(`SELECT * FROM 
                                employee a
                                LEFT JOIN role b
                                ON a.role_id = b.id
                                WHERE b.department_id = ${answer.departmentID}`)
                            .then((results) => displayTable('employee', results[0]))
                            .then(() => promptQuestions());
                    });
                    return;
                case 'View All Employees By Manager':
                    inquirer.prompt([
                        {
                            type: "input",
                            message: "Please enter the manager ID",
                            name: 'managerID',
                            validate(value) {
                                const valid =  !isNaN(parseInt(value));
                                return valid || 'Please enter a valid ID';
                            },
                        }
                    ]).then(answer => {
                        db.promise().query(`SELECT * FROM employee 
                                WHERE manager_id = ${answer.managerID}`)
                            .then((results) => displayTable('employee', results[0]))
                            .then(() => promptQuestions());
                    });
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
                // case 'Remove An Employee': 
                //     inquirer.prompt(questionsToAddRecord('employee'))
                //         .then(answer => {
                //             const { id } = answer;
                //             return db.promise().query(`DELETE FROM employee
                //                                 WHERE id = ${id});`)
                //         })
                //         .then(() => promptQuestions())
                //         .catch(err => console.error(err));
                //     return;
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
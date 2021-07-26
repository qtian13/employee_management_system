
const inquirer = require('inquirer');
const {displayTable} = require('./display');
const { db } = require('./connectDB');
const { throwError } = require('rxjs');

const options = ['View All Employees', 
                'View All Employees By Department', 
                'View All Employees By Manager',
                'Add An Employee',
                'Remove An Employee',
                'Update An Employee Role',
                'Update An Employee Manager',
                'View All Roles',
                'Add A Role',
                'Remove Role',
                'View All Departments',
                'Add A Department',
                'Remove A Department',
                'View Total Utilized Budget By Department',
                'quit'];
const createQuestionsAboutDepartMent = [{
    
}];

const promptQuestions = () => {
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'What would you like to do?',
                choices: options,
                name: 'todo'
            }
        ])
        .then((answer) => {
            switch (answer.todo) {
                case 'View All Employees':
                    db.promise().query(`SELECT * FROM employee`)
                            .then((results) => displayTable('employee', results[0]))
                            .then(() => promptQuestions());
                    return;
                case 'View All Roles':
                    displayTable("role");
                    return promptQuestions();
                case 'View All Departments':
                    displayTable("department");
                    return promptQuestions();
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
                default:
                    console.log('No idea how to do it');
                    return;
            }
        })
};

module.exports = promptQuestions;
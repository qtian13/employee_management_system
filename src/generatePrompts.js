
const inquirer = require('inquirer');
const cTable = require('console.table');

const { getEmployees, getEmployeesByDepartment, getEmployeesByManager, getRoles, getDepartments, addEmployee, addRole, addDepartment, updateEmployeeRole, updateEmployeeManager, removeEmployee, removeRole, removeDepartment, getTotalUtilizedBudgetByDepartment } = require('./dbOp');
const { questionsMenu, generateQuestionToSelectDepartment, generateQuestionToSelectManager, generateQuestionToSelectEmployee, generateQuestionToSelectRole, generateQuestionsToAddEmloyee, generateQuestionsToAddRole, generateQuestionToAddDepartment, generateQuestionsToUpdateRole, generateQuestionsToUpdateManager } = require('../helpers/questions');
const { throwError } = require('rxjs');

const promptQuestions = () => {
    inquirer
        .prompt(questionsMenu)
        .then((answer) => {
            switch (answer.todo) {
                case 'View All Employees': {
                    getEmployees()
                        .then(results => {
                            console.table(results);
                            promptQuestions();
                        })
                        .catch(err => console.log(err));
                    return;
                }
                case 'View All Employees By Department': {
                    generateQuestionToSelectDepartment()
                        .then(question => inquirer.prompt([question]))
                        .catch(err => console.log(err))
                        .then(answer => getEmployeesByDepartment(answer.department))
                        .catch(err => console.log(err))
                        .then(results => {
                            console.table(results);
                            promptQuestions();
                        })
                        .catch(err => console.log(err));
                    return;
                }
                case 'View All Employees By Manager': {
                    generateQuestionToSelectManager()
                        .then(question => inquirer.prompt([question]))
                        .catch(err => console.log(err))
                        .then(answer => getEmployeesByManager(answer.manager))
                        .catch(err => console.log(err))
                        .then(results => {
                            console.table(results);
                            promptQuestions();
                        })
                        .catch(err => console.log(err));
                    return;
                }
                case 'Add An Employee': {
                    generateQuestionsToAddEmloyee()
                        .then(questions => inquirer.prompt(questions))
                        .catch(err => console.log(err))
                        .then(answer => addEmployee(answer.first_name, answer.last_name, answer.role_id, answer.manager_id))
                        .catch(err => console.log(err))
                        .then(() => promptQuestions())
                        .catch(err => console.log(err));
                    return;
                }
                case 'Remove An Employee': {
                    generateQuestionToSelectEmployee()
                        .then(question => inquirer.prompt([question]))
                        .catch(err => console.log(err))
                        .then(answer => removeEmployee(answer.employee))
                        .catch(err => console.log(err))
                        .then(() => promptQuestions())
                        .catch(err => console.log(err));
                    return;
                }
                case 'Update An Employee Role': {
                    generateQuestionsToUpdateRole()
                        .then(questions => inquirer.prompt(questions))
                        .catch(err => console.log(err))
                        .then(answer => updateEmployeeRole(answer.role, answer.employee))
                        .catch(err => console.log(err))
                        .then(() => promptQuestions())
                        .catch(err => console.log(err));
                    return;
                }
                case 'Update An Employee Manager': {
                    generateQuestionsToUpdateManager()
                        .then(questions => inquirer.prompt(questions))
                        .catch(err => console.log(err))
                        .then(answer => updateEmployeeManager(answer.manager, answer.employee))
                        .catch(err => console.log(err))
                        .then(() => promptQuestions())
                        .catch(err => console.log(err));
                    return;
                }
                case 'View All Roles': {
                    getRoles()
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
                        .catch(err => console.log(err))
                        .then(answer => addRole(answer.title, parseFloat(answer.salary).toFixed(2), answer.department_id))
                        .catch(err => console.error(err))
                        .then(() => promptQuestions())
                        .catch(err => console.error(err));
                    return;
                }
                case 'Remove A Role': {
                    generateQuestionToSelectRole()
                        .then(question => inquirer.prompt([question]))
                        .catch(err => console.log(err))
                        .then(answer => removeRole(answer.role))
                        .catch(err => console.log(err))
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
                    generateQuestionToSelectDepartment()
                        .then(question => inquirer.prompt([question]))
                        .catch(err => console.log(err))
                        .then(answer => removeDepartment(answer.department))
                        .catch(err => console.log(err))
                        .then(() => promptQuestions())
                        .catch(err => console.log(err));
                    return;
                }
                case 'View Total Utilized Budget By Department' : {
                    getTotalUtilizedBudgetByDepartment()
                        .then(results => {
                            console.table(results);
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
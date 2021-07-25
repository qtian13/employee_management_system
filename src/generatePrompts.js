const inquirer = require('inquirer');

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
                options: options,
                name: 'todo'
            }
        ])
        .then(answer => {
            switch (answer.todo) {
                case 'View All Employees':
                    display(getAllEmployees());
                    break;
                default:
                    console.log('No idea how to do it');
            }
        })
}
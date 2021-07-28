const { getEmployees, getManagers, getRoles, getDepartments } = require('../src/dbOp');

const options = ['View All Employees', 
                'View All Employees By Department', 
                'View All Employees By Manager',
                'Add An Employee',
                'Remove An Employee',
                'Update An Employee Role',
                'Update An Employee Manager',
                'View All Roles',
                'Add A Role',
                'Remove A Role',
                'View All Departments',
                'Add A Department',
                'Remove A Department',
                'View Total Utilized Budget By Department',
                'Quit'];

const questionsMenu = [{
                        type: 'list',
                        message: 'What would you like to do?',
                        choices: options,
                        name: 'todo'
                    }];

const generateChoicesOfDepartment = () => {
    return getDepartments()
        .then(result => result.map(department => {
            let choice = {};
            choice.name = department.name;
            choice.value = department.id;
            return choice
        }))
        .catch(err => console.log(err))
}

const generateQuestionToSelectDepartment = () => {
    return generateChoicesOfDepartment()
        .then(choices => generateListQuestions('department', choices));
}

const generateQuestionToSelectManager = () => {
    return generateChoicesOfManager()
        .then(choices => generateListQuestions('manager', choices))
        .catch(err => console.log(err));
}

const generateChoicesOfRole = () => {
    return getRoles()
        .then(result => result.map(role => {
            let choice = {};
            choice.name = role.title + " in " + role.department;
            choice.value = role.id;
            return choice
        }))
        .catch(err => console.log(err))
}

const generateChoicesOfManager = () => {
    return getManagers()
                .then(result => result.map(manager => {
                    let choice = {};
                    choice.name = manager.title + " " + manager.manager_name + " in " + manager.department;
                    choice.value = manager.id;
                    return choice
                }))
                .catch(err => console.log(err))
}

const generateChoicesOfEmployee = () => {
    return getEmployees()
                .then(result => result.map(employee => {
                    let choice = {};
                    choice.name = `${employee.title} ${employee.first_name} ${employee.last_name} in ${employee.department}`;
                    choice.value = employee.id;
                    return choice
                }))
                .catch(err => console.log(err))
}

const generateQuestionToSelectEmployee = () => {
    return generateChoicesOfEmployee()
        .then(choices => generateListQuestions('employee', choices))
        .catch(err => console.log(err));
}

const generateQuestionToSelectRole = () => {
    return generateChoicesOfRole()
                .then(choices => generateListQuestions('role', choices))
                .catch(err => console.log(err))
}

const generateQuestionsToUpdateRole = () => {
    let questions = [];
    return generateQuestionToSelectEmployee()
                .then(question => {
                    questions.push(question);
                    return generateQuestionToSelectRole();
                })
                .catch(err => console.log(err))
                .then(question => {
                    questions.push(question);
                    return questions;
                })
                .catch(err => console.log(err));
}

const generateQuestionsToUpdateManager = () => {
    let questions = [];
    return generateQuestionToSelectEmployee()
                .then(question => {
                    questions.push(question);
                    return generateQuestionToSelectManager();
                })
                .catch(err => console.log(err))
                .then(question => {
                    questions.push(question);
                    return questions;
                })
                .catch(err => console.log(err));
}

const generateCharInputQuestions = (tableName, columnName, maxLength) => {
    const type = 'input';
    const name = columnName;
    const message = `Please enter the ${columnName} of ${tableName}`;
    let question = {
        type,
        name,
        message,
        validate(value) {
            const valid = (value.trim().length <= maxLength);
            return valid || `Please enter no more than 30 characters`;
        }
    };
    return question;
}

const generateIntInputQuestions = (tableName, columnName) => {
    const type = 'input';
    const name = columnName;
    const message = `Please enter the ${columnName} of ${tableName}`;
    let question = {
        type,
        name,
        message,
        validate(value) {
            const valid = !isNaN(parseInt(value));
            return valid || `Please enter an integer`;
        }
    };
    return question;
}

const generateFloatInputQuestions = (tableName, columnName) => {
    const type = 'input';
    const name = columnName;
    const message = `Please enter the ${columnName} of ${tableName}`;
    let question = {
        type,
        name,
        message,
        validate(value) {
            const valid = !isNaN(parseFloat(value));
            return valid || `Please enter a float number`;
        }
    };
    return question;
}

const generateListQuestions = (answerName, choices) => {
    const type = 'list';
    const name = answerName;
    const message = `Please select the ${answerName}`;
    let question = {
        type,
        name,
        message,
        choices
    };
    return question;
}

const generateQuestionsToAddEmloyee = () => {
    let questions = [
        generateCharInputQuestions('employee', 'first_name', 30),
        generateCharInputQuestions('employee', 'last_name', 30)
    ]
    return generateChoicesOfRole()
                .then(choices => {
                    questions.push(generateListQuestions('role_id', choices));
                    return generateChoicesOfManager();
                })
                .catch(err => console.log(err))
                .then(choices => {
                    questions.push(generateListQuestions('manager_id', choices));
                    return questions;
                })
                .catch(err => console.log(err));
};

const generateQuestionsToAddRole = () => {
    return generateChoicesOfDepartment()
                .then(choices => [
                                    generateCharInputQuestions('role', 'title', 30),
                                    generateFloatInputQuestions('role', 'salary'),
                                    generateListQuestions('department_id', choices)
                                ])
                .catch(err => console.log(err));
};

const generateQuestionToAddDepartment = () => [generateCharInputQuestions('department', 'name', 30)];

const questionsToRemoveRecord = (tableName) => [{
    type: 'input',
    message: `Please enter ${tableName} id to delete`,
    name: 'id',
    validate(value) {
        const valid = !isNaN(parseInt(value));
        return valid || 'Please enter a number';
    }
}];

module.exports = {
    questionsMenu,
    generateQuestionToSelectDepartment,
    generateQuestionToSelectManager,
    generateQuestionToSelectEmployee,
    generateQuestionToSelectRole,
    generateQuestionToSelectDepartment,
    generateQuestionsToAddEmloyee,
    generateQuestionsToAddRole,
    generateQuestionToAddDepartment,
    generateQuestionsToUpdateRole,
    generateQuestionsToUpdateManager,
};


const { db } = require('../src/connectDB');
const { getEmployee, getRole, getDepartments, addDepartment } = require('../src/dbOp');

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

const questionsToAddRecord = (tableName) => {
    return db.promise().query('DESCRIBE ' + tableName)
        .then((results) => results[0])
        .catch(console.error())
        .then((columnsInfo) => {
            const questions = [];
            columnsInfo.forEach(columnInfo => {
                
                if (columnInfo.Extra !== 'auto_increment') {
                    
                    let question = {};
                    const type = 'input';
                    const message = `Please enter ${tableName}'s ${columnInfo.Field}`;
                    const name = columnInfo.Field;
                    const contentType = columnInfo.Type.toLowerCase();
                    if (columnInfo.Type.toLowerCase() === 'int') {
                        question = {
                            type,
                            message,
                            name,
                            validate(value) {
                                const valid = !isNaN(parseInt(value));
                                return valid || 'Please enter a number';
                            },
                        };
                    } else if (contentType.substring(0, 7) === 'varchar') {
                        const maxLength = parseInt(contentType.substring(8));
                        question = {
                            type,
                            message,
                            name,
                            validate(value) {
                                const valid = value.length <= maxLength;
                                return valid || `Please enter no more than ${maxLength} characters`;
                            },
                        };
                    } else {
                        question = {
                            type,
                            message,
                            name
                        };
                    }
                    questions.push(question);
                }
            });
            return questions;
        });
}

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

// generateChoicesOfDepartment().then(result => console.log(result));

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

const questionsToReadRecord = (tableName, column) => [{
    type: "input",
    message: `Please enter the ${column}_id`,
    name: `${column}_id`,
    validate(value) {
        const valid =  !isNaN(parseInt(value));
        return valid || 'Please enter a valid ID';
    }
}]

const questionsToUpdateRecord = (tableName, column) => {
    return [
        {
            type: 'input',
            message: `Please enter ${tableName} id to update`,
            name: 'id',
            validate(value) {
                const valid = !isNaN(parseInt(value));
                return valid || 'Please enter a number';
            }
        },
        {
            type: 'input',
            message: `Please enter ${column}_id to update`,
            name: `${column}_id`,
            validate(value) {
                const valid = !isNaN(parseInt(value));
                return valid || 'Please enter a number';
            }
        }
    ];
};

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
    questionsToAddRecord,
    generateQuestionsToAddRole,
    generateQuestionToAddDepartment,
    questionsToReadRecord,
    questionsToUpdateRecord,
    questionsToRemoveRecord
};


const { db } = require('../src/connectDB');

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
    questionsToUpdateRecord,
    questionsToRemoveRecord
};


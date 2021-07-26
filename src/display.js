const { db } = require('./connectDB');


const displayTable = (tableName, records) => {
    return db.promise().query('DESCRIBE ' + tableName)
        .then((results) => getColumnsName(results[0]))
        .catch(console.error())
        .then((columnsFormat) => {
            updatedColumnsFormat = updateColumnsFormat(columnsFormat, records);
            formatTable(updatedColumnsFormat, records);
            return;
        })
};

const getColumnsName = (columns) => {
    let columnsFormat = {};
    columns.forEach(object => {
        const column = object.Field;
        columnsFormat[column] = column.length;
    });
    if (('first_name' in columnsFormat) && ('last_name' in columnsFormat)) {
        delete columnsFormat.first_name;
        delete columnsFormat.last_name;
        columnsFormat.name = "name".length;
    }
    return columnsFormat;
}

const formatTable = (columnsFormat, records) => {
    let tableHeader = "";
    let seperator = "";
    Object.keys(columnsFormat).forEach((key) => {
        tableHeader += key + displaySymbol(columnsFormat[key] - key.length, " ") + "  ";
        seperator += displaySymbol(columnsFormat[key], "-") + "  ";
    })
    console.log(tableHeader);
    console.log(seperator);
    records.forEach(record => {
        let recordRow = "";
        Object.keys(columnsFormat).forEach(key => {
            recordRow += record[key] + displaySymbol(columnsFormat[key] - (record[key] + "").length, " ") + "  ";
        })
        console.log(recordRow);
    })
}

const updateColumnsFormat = (columnsFormat, records) => {
    records.forEach(record => {
        let name = "";
        let hasFirstName = false;
        let hasLastName = false;
        Object.keys(record).forEach(key => {
            if (key === 'first_name') {
                hasFirstName = true;
                name = record[key] + name;
            }
            if (key === 'last_name') {
                hasLastName = true;
                name += " " + record[key];
            }
            if (hasFirstName && hasLastName) {
                delete record.first_name;
                delete record.last_name;
                delete columnsFormat.first_name;
                delete columnsFormat.last_name;
                record.name = name;
                columnsFormat.name = Math.max(columnsFormat.name, name.length);
            } else {
                columnsFormat[key] = Math.max(columnsFormat[key], (record[key] + "").length);
            }
        });
    });
    return columnsFormat;
}


const displaySymbol = (length, symbol) => {
    let symbols = "";
    for (let i = 0; i < length; i++) {
        symbols += symbol;
    }
    return symbols;
};

module.exports = {
    displayTable,
    getColumnsName
};
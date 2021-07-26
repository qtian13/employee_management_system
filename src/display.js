const db = require('./connectDB');

const displaySymbol = (length, symbol) => {
    let symbols = "";
    for (let i = 0; i < length; i++) {
        symbols += symbol;
    }
    return symbols;
};

const displayTable = (tableName) => {
    db.promise().query('DESCRIBE ' + tableName)
        .then((results) => {
            let columnsLength = {};
            results[0].forEach(object => {
                const column = object.Field;
                columnsLength[column] = column.length;
            });
            if (('first_name' in columnsLength) && ('last_name' in columnsLength)) {
                delete columnsLength.first_name;
                delete columnsLength.last_name;
                columnsLength.name = "name".length;
            }
            return columnsLength;
        })
        .catch(console.log)
        .then((columnsLength) => {
            db.promise().query('SELECT * FROM ' + tableName)
                .then((results) => {
                    results[0].forEach(record => {
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
                                delete columnsLength.first_name;
                                delete columnsLength.last_name;
                                record.name = name;
                                columnsLength.name = Math.max(columnsLength.name, name.length);
                            } else {
                                columnsLength[key] = Math.max(columnsLength[key], (record[key] + "").length);
                            }
                        });
                    });
                    formatTable(columnsLength, results[0]);
                });
        })
};

const formatTable = (columnsLength, records) => {
    let tableHeader = "";
    let seperator = "";
    Object.keys(columnsLength).forEach((key) => {
        tableHeader += key + displaySymbol(columnsLength[key] - key.length, " ") + "  ";
        seperator += displaySymbol(columnsLength[key], "-") + "  ";
    })
    console.log(tableHeader);
    console.log(seperator);
    records.forEach(record => {
        let recordRow = "";
        Object.keys(record).forEach(key => {
            recordRow += record[key] + displaySymbol(columnsLength[key] - (record[key] + "").length, " ") + "  ";
        })
        console.log(recordRow);
    })
}

module.exports = {
    displayTable
};
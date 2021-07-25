const displaySymbol = (length, symbol) => {
    let symbols = "";
    for (let i = 0; i < length; i++) {
        symbols += symbol;
    }
    return symbols;
};

const displayEmployee = (employees) => {
    let idLength = "id".length;
    let nameLength = "name".length;
    let managerIdLength = "manager_id".length;
    Object.keys(employees).forEach(key => {
        const {id, first_name, last_name, manager_id} = employees[key];
        idLength = Math.max((id + "").length, idLength);
        nameLength = Math.max((first_name + " " + last_name).length, nameLength);
        managerIdLength = Math.max((manager_id + "").length, managerIdLength);
    })

    const idHeader = "id" + displaySymbol(idLength - "id".length, " ");
    const nameHeader = "name" + displaySymbol(nameLength - "name".length, " ");
    const manageIdHeader = "manager_id" + displaySymbol(managerIdLength - "manager_id".length, " ");
    console.log(`${idHeader}  ${nameHeader}  ${manageIdHeader}`);
    console.log(`${displaySymbol(idLength, "-")}  ${displaySymbol(nameLength, "-")}  ${displaySymbol(managerIdLength, "-")}`);

    Object.keys(employees).forEach(key => {
        const {id, first_name, last_name, manager_id} = employees[key];
        const idFormatted = id + displaySymbol(idLength - (id + "").length, " ");
        const name = first_name + " " + last_name;
        const nameFormatted = name + displaySymbol(nameLength - name.length, " ");
        const managerIdFormatted = manager_id + displaySymbol(managerIdLength - (manager_id + "").length, " ");
        console.log(`${idFormatted}  ${nameFormatted}  ${managerIdFormatted}`);
    })
};

module.exports = {
    displayEmployee
};
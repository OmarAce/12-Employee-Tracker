const util = require("util");
const mysql = require("mysql2");
const {prompt} = require("inquirer");

const db = mysql.createConnection({
    host:"localhost",
    //PUT YOUR OWN CREDENTIALS HERE IN THE CONNECTION CONFIG OBJECT MAKE SURE YOU RUN THE SCHEMA.SQL FIRST!!!
    user: "root",
    password: "root",
    database: "employees_db"
});

const query = util.promisify(db.query).bind(db);

const queryManager = {
    view(tableName){
        console.log(tableName)
        return query(`SELECT * FROM ${tableName}`)
    },
    async add(tableName){
        const {id, title, first_name, last_name, salary, role_id, department_id, manager_id } = await prompt([
        {
            when: tableName = department,
            message: `What ${tableName.slice(0,-1)} would you like to add?`,
            name: 'name',
        }, 
        {
            message: `How many calories is this ${tableName.slice(0,-1)}?`,
            name: "calories",
            type: "list",
            choices: [20, 50, 100, 150, 200, 1000]
        },
        {
            message: `How much is this ${tableName.slice(0,-1)}?`,
            name: "price",
            type: "input",
            validate: (val) => {
                return !isNaN(val) || "you need to put a number fool!"
            }
        },
    ]);

    return query(`INSERT INTO ${tableName}
     (${tableName.slice(0,-1)}, calories, price) VALUES ('${name}', ${calories}, ${price})`)
    },
    async delete(tableName){
        const data = await query(`SELECT * FROM ${tableName}`);
        console.log(data);
        const {selection} = await prompt({
            message: `Which ${tableName.slice(0,-1)} would you like to remove?`,
            type: "list",
            choices: data.map(item => ({name: item[tableName.slice(0,-1)], value: item.id})),
            name: 'selection'
        });

        return query(`DELETE FROM ${tableName} WHERE id = ${selection}`)
    }
}

module.exports = queryManager;
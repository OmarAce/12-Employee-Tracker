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
        console.log(tableName);
        const roleData = await query(`SELECT * FROM roles`);
        const managerData = await query(`SELECT * FROM employees WHERE manager_id IS NULL`);

        const {id, name, title, first_name, last_name, salary, role_id, department_id, manager, manager_id } = await prompt([
        {
            when: (tableName) == "departments",
            message: `What ${tableName.slice(0,-1)} would you like to add?`,
            name: 'name',
        }, 
        {
            when: (tableName) == "roles",
            message: `What is the title of the ${tableName.slice(0,-1)}?`,
            name: "title",
        },
        {
            when: (tableName) == "roles",
            message: `What is this ${tableName.slice(0,-1)}'s salary?`,
            name: "salary",
            type: "input0",
            validate: (val) => {
                return !isNaN(val) || "you need to input a number!"
            }
        },
        {
            when: (tableName) == "roles",
            message: `What is this ${tableName.slice(0,-1)}'s deparment id?`,
            name: "department_id",
            type: "input",
            validate: (val) => {
                return !isNaN(val) || "you need to input a number!"
            }
        },
        {
            when: (tableName) == "employees",
            message: `What is this ${tableName.slice(0,-1)}'s first name?`,
            name: "first_name",
        },
        {
            when: (tableName) == "employees",
            message: `What is this ${tableName.slice(0,-1)}'s last name?`,
            name: "last_name",
        },
        {
            when: (tableName) == "employees",
            message: "What is this employee's role id?",
            name: "role_id",
            type: "list",
            choices: roleData.map(item => ({name: item.title, value: item.id})),
        },
        {
            when: (tableName) == "employees",
            message: "Who is this employee's manager",
            name: "manager_id",
            type: "list",
            choices: managerData.map(item => ({name: item.first_name+" "+item.last_name, value: item.id}))
        },
    ]);
        if (tableName == "departments") {
            return query(`INSERT INTO ${tableName}
            (name) VALUES ('${name}')`)
        };
        if (tableName == "roles") {
            return query(`INSERT INTO ${tableName}
            (title, salary, department_id) VALUES ('${title}', ${salary}, ${department_id})`)
        };
        if (tableName == "employees") {
            return query(`INSERT INTO ${tableName} 
            (first_name, last_name, role_id, manager_id) VALUES ('${first_name}', '${last_name}', ${role_id}, ${manager_id})`)
    };
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
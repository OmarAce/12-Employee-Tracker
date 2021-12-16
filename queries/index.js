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
        console.log(managerData)
        const {id, name, title, first_name, last_name, salary, role_id, department_id, isManager, manager_id } = await prompt([
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
            message: "Is this employee a manager?",
            name: "isManager",
            type: "confirm",
        },
        {
            when: (input) => input.isManager == false,
            message: "Who is this employee's manager",
            name: "manager_id",
            type: "list",
            choices: managerData.map(item => ({name: item.first_name+" "+item.last_name, value: item.id})),
        },
        {
            when: (input) => input.isManager == true,
            message: "Employee is a Manager, no input necessary, Hit Enter",
            name: "manager_id",
            type: "list",
            choices: ["NULL"]
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
        console.table(data);
        const {selection} = await prompt({
            message: `Which ${tableName.slice(0,-1)} would you like to remove?`,
            type: "list",
            choices: data.map(item => ({name: item[tableName.slice(0,-1)], value: item.id})),
            name: 'selection'
        });

        return query(`DELETE FROM ${tableName} WHERE id = ${selection}`)
    },
    async update(tableName){
        const employeeData = await query(`SELECT * FROM employees`);
        const roleData = await query(`SELECT * FROM roles`);
        const managerData = await query(`SELECT * FROM employees WHERE manager_id IS NULL`);
        console.table(employeeData);
        const {employee, field, isManager, value} = await prompt([
            {
                message: `Which ${tableName.slice(0,-1)} would you like to update?`,
                type: "list",
                choices: employeeData.map(item => ({name: item.first_name+" "+item.last_name, value: item.id})),
                name: 'employee'
            },
            {
                message: `Which field would you like to update?`,
                type: "list",
                choices:[
                            {name: "first name", value: "first_name"},
                            {name: "last name", value: "last_name"},
                            {name: "role", value: "role_id"},
                            {name: "manager", value: "manager_id"}   
                        ],
                name: 'field'
            },
            {
                when: (input) => input.field == "first_name",
                message: "Please enter a first name to be updated with",
                name: "value",
                type: "input",
            },
            {
                when: (input) => input.field == "last_name",
                message: "Please enter a last name to be updated with.",
                name: "value",
                type: "input",
            },
            {
                when: (input) => input.field == "role_id",
                message: "Please select a new role",
                name: "value",
                type: "list",
                choices: roleData.map(item => ({name: item.title, value: item.id})),
            },
            {
                when: (input) => input.field == "manager_id",
                message: "Is this employee now a manager?",
                name: "isManager",
                type: "confirm",
            },
            {
                when: (input) => input.isManager == true,
                message: "Employee is now a Manager, no input necessary, Hit Enter",
                name: "value",
                type: "list",
                choices: ["NULL"]
            },
            {
                when: (input) => input.isManager == false,
                message: "Please select who is now this employee's manager",
                name: "value",
                type: "list",
                choices: managerData.map(item => ({name: item.first_name+" "+item.last_name, value: item.id})),
            },
        ]);
        
        return query(`UPDATE ${tableName} SET ${field} = "${value}" WHERE id = ${employee}`)
    }
}

module.exports = queryManager;
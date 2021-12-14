const {prompt} = require("inquirer");
const db = require("./queries");

const main = async () => {
   const response = await prompt({
        message:"Hey welcome to thirty one flavors what do you want to do?",
        type: "list",
        name: "choice",
        choices: [
        {name:"View All Employees", value: "view employees"}, 
        {name:"Add Employee", value: "add employees"}, 
        {name:"Update Employee Role", value: "update employees"},
        {name: "View All Roles", value: "views roles"},
        {name: "Add Role", value: "add roles"},
        {name: "View All Departments", value: "view departments"},
        {name: "Add Departments", value: "add departments"},
        {name: "Quit", value: "quit"},
    ]
    })
    const [method, argument] = response.choice.split(" ") //["view", "flavors"]
    const result = await db[method](argument);
    console.table(result);
    setTimeout(main, 1500);
}

main();
// Dependencies
const {prompt} = require("inquirer");
const db = require("./queries");

// Main terminal page/Home Paage
const main = async () => {
   const response = await prompt({
        message: "Welcome to the employee database. What would you like to do?",
        type: "list",
        name: "choice",
        choices: [
        {name: "View All Employees", value: "view employees"}, 
        {name: "View Employees by Manager", value: "view2 employees"}, 
        {name: "View Employees by Department", value: "view3 employees"}, 
        {name: "View Budget by Department", value: "view4 employees"},
        {name: "Add Employee", value: "add employees"}, 
        {name: "Update Employee", value: "update employees"},
        {name: "Delete Employee", value: "delete employees"},
        {name: "View All Roles", value: "view roles"},
        {name: "Add Role", value: "add roles"},
        {name: "Delete Role", value: "delete roles"},
        {name: "View All Departments", value: "view departments"},
        {name: "Add Departments", value: "add departments"},
        {name: "Delete Department", value: "delete departments"},
    ]
    })
    //Splitting responses into a method and argument
    const [method, argument] = response.choice.split(" ") //[ex. "view", "flavors"]
    //Await result from query manager
    const result = await db[method](argument);
    console.log(response);
    console.log(result);
    console.table(result);
    //Returns to main page
    setTimeout(main, 1500);
}

//Initializes Application
main();
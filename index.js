const pgp = require("pg-promise");
const inquirer = require("inquirer");

// conditional prompt depending on choice
// src: https://stackoverflow.com/questions/56412516/conditional-prompt-rendering-in-inquirer
const questions = [
    {
    type: "list",
    message: "What would you like to do?",
    name: "option",
    choices: ["View all employees", 
        "Add employee", 
        "Update employee role", 
        "View all roles",
        "Add role",
        "View all departments",
        "Add department",
        "Quit"
    ]},
    // questions to ask if Add employee is selected
    {
        type: "input",
        message: "What is the employee's first name?",
        name: "firstName",
        when: (response) => response.option === "Add employee"
    },
    {
        type: "input",
        message: "What is the employee's last name name?",
        name: "lastName",
        when: (response) => response.firstName
    },
    {
        type: "input",
        message: "What is the employee's role?",
        name: "employeeRole",
        when: (response) => response.lastName
    },
    {
        type: "input",
        message: "Who's the employee's manager?",
        name: "employeeManager",
        when: (response) => response.employeeRole
    },
    // questions to ask if Add role is selected
    {
        type: "input",
        message: "What is the name of the role?",
        name: "role",
        when: (response) => response.option === "Add role"
    },
    {
        type: "input",
        message: "What is the salary of the role?",
        name: "roleSalary",
        when: (response) => response.role
    },
    {
        type: "input",
        message: "Which department does the role belong to?",
        name: "dept",
        when: (response) => response.roleSalary
    },
    // question to ask if Add department is selected
    {
        type: "input",
        message: "What is the name of the department?",
        name: "dept",
        when: (response) => response.option === "Add department"
    }
]

// function to show inquirer prompt to user
const showPrompt = (questions) => {
    inquirer
    .prompt(questions)
    .then((response) => {
        // if user selects Quit, exit out of inquirer promopt
        if (response.option === "Quit") {
            process.exit();
        }
        // otherwise, show, add to, or update table depending on selection
        else {
            if (response.option === "View all employees") {
                
            } else if (response.option === "Add employee") {

            } else if (response.option === "Update employee role") {

            } else if (response.option === "View all roles") {

            } else if (response.option === "Add role") {
                
            } else if (response.option === "View all departments") {
                
            } else {

            }
            
            // show prompt again using recursion
            showPrompt(questions);
        }
    })
}

showPrompt(questions);
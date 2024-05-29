const pgp = require("pg-promise");
const inquirer = require("inquirer");

const questions = [
    {
    type: "list",
    message: "What would you like to do?",
    name: "activity",
    choices: ["View all employees", 
        "Add employee", 
        "Update employee role", 
        "View all roles",
        "Add role",
        "View all departments",
        "Add department",
        "Quit"
    ]},
    {
        type: "input",
        message: "What is the employee's first name?",
        name: "firstName",
        when: (response) => response.activity === "Add employee"
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
    {
        type: "input",
        message: "What is the name of the role?",
        name: "role",
        when: (response) => response.activity === "Add role"
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
    {
        type: "input",
        message: "What is the name of the department?",
        name: "dept",
        when: (response) => response.activity === "Add department"
    }
]


// conditional prompt depending on choice
// src: https://stackoverflow.com/questions/56412516/conditional-prompt-rendering-in-inquirer
inquirer
    .prompt(questions)
    .then((response) => {
    }
    );
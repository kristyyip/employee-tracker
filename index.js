const pg = require("pg");
const inquirer = require("inquirer");
const { Console } = require('console');
const { Transform } = require('stream');
const {findEmployees, findDeptEmployees, findRoles, findDeptRole, findDepartments, addEmployee, addRole, addDepartment} = require("./db");
const { create } = require("domain");

// remove (index) column from console.table
// src: https://stackoverflow.com/questions/49618069/remove-index-from-console-table
function table(input) {
    // @see https://stackoverflow.com/a/67859384
    const ts = new Transform({ transform(chunk, enc, cb) { cb(null, chunk) } })
    const logger = new Console({ stdout: ts })
    logger.table(input)
    const table = (ts.read() || '').toString()
    let result = '';
    for (let row of table.split(/[\r\n]+/)) {
      let r = row.replace(/[^┬]*┬/, '┌');
      r = r.replace(/^├─*┼/, '├');
      r = r.replace(/│[^│]*/, '');
      r = r.replace(/^└─*┴/, '└');
      r = r.replace(/'/g, ' ');
      result += `${r}\n`;
    }
    console.log(`\n${result}`);
  }

  async function createRoleChoices() {
    const {rows} = await findRoles();
    const roleChoices = rows.map(({id, title}) => 
        ({
            value: id, 
            name: title,
        })
    );

    return roleChoices;
}

async function createEmployeeChoices() {
    const {rows} = await findEmployees();
    const employeeChoices = rows.map(({id, first_name, last_name}) => 
        ({
            value: id, 
            name: `${first_name} ${last_name}`,
        })
    );

    return employeeChoices;
}

async function findDeptID(roleID) {
    const {rows} = await findDeptRole(roleID);
    return rows[0].department;
}

async function createManagerChoices(roleID) {
    const deptID = await findDeptID(roleID);

    const {rows} = await findDeptEmployees(deptID);
    const managerChoices = rows.map(({id, first_name, last_name}) => 
        ({
            value: id, 
            name: `${first_name} ${last_name}`,
        })
    );

    return managerChoices;
}

async function addEmployeePrompt() {
    let roleChoices = await createRoleChoices();
    
    await inquirer
    .prompt([
        {
            type: "input",
            message: "What is the employee's first name?",
            name: "firstName",
        },
        {
            type: "input",
            message: "What is the employee's last name name?",
            name: "lastName",
            when: (response) => response.firstName
        },
        {
            type: "list",
            message: "What is the employee's role?",
            name: "employeeRole",
            choices: roleChoices,
            when: (response) => response.lastName
        },
    ])
    .then(async (response) => {
        let managerChoices = await createManagerChoices(response.employeeRole);

        await inquirer
        .prompt([
        {
            type: "list",
            message: "Who's the employee's manager?",
            choices: managerChoices,
            name: "employeeManager"
        },])
        .then((res) => {
            addEmployee(response.firstName, response.lastName, response.employeeRole, res.employeeManager);
        })
    })

}

async function createDeptChoices() {
    const {rows} = await findDepartments();
    const deptChoices = rows.map(({id, name}) => 
        ({
            value: id, 
            name: name,
        })
    );

    return deptChoices;
}

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
    
    // questions to ask if Update employee role is selected
    
    // questions to ask if Add role is selected
    
    // question to ask if Add department is selected
   
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
                findEmployees()
                    .then(({rows}) => table(rows));
            } else if (response.option === "Add employee") {
                addEmployeePrompt();
            } else if (response.option === "Update employee role") {
                // {
                //     type: "input",
                //     message: "Which employee's role do you want to update?",
                //     name: "employee",
                //     when: (response) => response.option === "Update employee role"
                // },
                // {
                //     type: "input",
                //     message: "Which role do you want to assign the selected employee?",
                //     name: "newRole",
                //     when: (response) => response.employee
                // },
            } else if (response.option === "View all roles") {
                findRoles()
                    .then(({rows}) => table(rows));
            } else if (response.option === "Add role") {
                // {
                //     type: "input",
                //     message: "What is the name of the role?",
                //     name: "title",
                //     when: (response) => response.option === "Add role"
                // },
                // {
                //     type: "input",
                //     message: "What is the salary of the role?",
                //     name: "salary",
                //     when: (response) => response.title
                // },
                // {
                //     type: "input",
                //     message: "Which department does the role belong to?",
                //     name: "deptName",
                //     // choices: deptChoices,
                //     when: (response) => response.salary
                // },
            } else if (response.option === "View all departments") {
                findDepartments()
                    .then(({rows}) => table(rows));
            } else {
                // {
                //     type: "input",
                //     message: "What is the name of the department?",
                //     name: "dept",
                //     when: (response) => response.option === "Add department"
                // }
            }
    }})
}

showPrompt(questions);
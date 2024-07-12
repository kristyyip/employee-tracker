const pg = require("pg");
const inquirer = require("inquirer");
const { Console } = require('console');
const { Transform } = require('stream');
const {findEmployees, findDeptEmployees, updateEmployee, findRoles, findDeptRole, findDepartments, addEmployee, addRole, addDepartment} = require("./db");

// table formatting since (index) column shows when using console.table
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

// function to dynamically list role choices for prompt by querying database
async function createRoleChoices() {
    const {rows} = await findRoles();
    // loop through array to create new array in choices format
    // src: https://stackoverflow.com/questions/65415706/how-to-get-index-value-of-choice-made-with-inquirer
    const roleChoices = rows.map(({id, title}) => 
        ({
            value: id, 
            name: title,
        })
    );

    return roleChoices;
}

// function to dynamically list employee choices for prompt by querying database
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

// function to find the department id given a role (needed to create a dynamic list of manager options)
async function findDeptID(roleID) {
    const {rows} = await findDeptRole(roleID);
    return rows[0].department;
}

// function to dynamically list manager choices in a given department for prompt by querying database
async function createManagerChoices(roleID) {
    const deptID = await findDeptID(roleID);

    const {rows} = await findDeptEmployees(deptID);
    const managerChoices = rows.map(({id, first_name, last_name}) => 
        ({
            value: id, 
            name: `${first_name} ${last_name}`,
        })
    );

    // add a "None" option
    managerChoices.push({value: null, name: "None"})

    return managerChoices;
}

// function to dynamically list department choices for prompt by querying database
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

// function to ask questions about employee info and inserts data into database
async function addEmployeePrompt() {
    const roleChoices = await createRoleChoices();
    
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
            // prompt shows up after previous prompt is answered
            // src: https://stackoverflow.com/questions/56412516/conditional-prompt-rendering-in-inquirer
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
        const managerChoices = await createManagerChoices(response.employeeRole);

        await inquirer
        .prompt([
            {
                type: "list",
                message: "Who's the employee's manager?",
                choices: managerChoices,
                name: "employeeManager"
            },
        ])
        .then((res) => {
            addEmployee(response.firstName, response.lastName, response.employeeRole, res.employeeManager);
            console.log(`Added ${response.firstName} ${response.lastName} to database`);
        })
    })

}

// function to ask questions about employee info and update data into database
async function updateEmployeePrompt() {
    const employeeChoices = await createEmployeeChoices();
    const roleChoices = await createRoleChoices()

    await inquirer
    .prompt([
        {
            type: "list",
            message: "Which employee's role do you want to update?",
            name: "employee",
            choices: employeeChoices,
        },
        {
            type: "list",
            message: "Which role do you want to assign the selected employee?",
            name: "newRole",
            choices: roleChoices,
            when: (response) => response.employee
        },
    ])
    .then(async (response) => {
        const managerChoices = await createManagerChoices(response.newRole);

        await inquirer
        .prompt([
            {
                type: "list",
                message: "Who's the new employee's manager?",
                choices: managerChoices,
                name: "employeeManager"
            }
        ])
        .then((res) => {
            updateEmployee(response.employee, response.newRole, res.employeeManager);
            console.log("Updated employee's role")
        })
    })
}

// // function to ask questions about role info and inserts data into database
async function addRolePrompt() {
    const deptChoices = await createDeptChoices();

    await inquirer
    .prompt([
        {
            type: "input",
            message: "What is the name of the role?",
            name: "title",
        },
        {
            type: "input",
            message: "What is the salary of the role?",
            name: "salary",
            when: (response) => response.title
        },
        {
            type: "list",
            message: "Which department does the role belong to?",
            name: "deptID",
            choices: deptChoices,
            when: (response) => response.salary
        },
    ])
    .then((response) => {
        addRole(response.title, response.salary, response.deptID);
        console.log(`Added ${response.title} to database`);
    })
}

// // function to ask questions about department info and inserts data into database
async function addDepartmentPrompt() {
    await inquirer
    .prompt([
        {
            type: "input",
            message: "What is the name of the department?",
            name: "dept",
        }
    ])
    .then((response) => {
        addDepartment(response.dept);
        console.log(`Added ${response.dept} to database`);
    })
}

// function to show inquirer prompt to user
const showPrompt = () => {
    inquirer
    .prompt([
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
    ])
    .then(async (response) => {
        // if user selects Quit, exit out of inquirer promopt
        if (response.option === "Quit") {
            process.exit();
        }
        // otherwise, show, add to, or update table depending on selection
        // once those actions are completed, show initial prompt again
        else {
            if (response.option === "View all employees") {
                await findEmployees()
                    .then(({rows}) => table(rows));
            } else if (response.option === "Add employee") {
                await addEmployeePrompt();
            } else if (response.option === "Update employee role") {
                await updateEmployeePrompt();
            } else if (response.option === "View all roles") {
                await findRoles()
                    .then(({rows}) => table(rows));
            } else if (response.option === "Add role") {
                await addRolePrompt();
            } else if (response.option === "View all departments") {
                await findDepartments()
                    .then(({rows}) => table(rows));
            } else {
                await addDepartmentPrompt();
            }

            // use recursion to show prompt again
            showPrompt();
    }})
}

showPrompt();
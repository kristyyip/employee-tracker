const { Pool } = require("pg");

const pool = new Pool (
    {
        user: "kristyyip",
        password: "",
        host: "localhost",
        database: "employee_db"
    },
    console.log("Connected to the employee_db database")
);

pool.connect();

// function to view all employees
function findEmployees() {
  return pool.query("SELECT e1.id, e1.first_name, e1.last_name, role.title, department.name as department, salary, CONCAT(e2.first_name, ' ', e2.last_name) as manager FROM employee AS e1 LEFT JOIN role ON e1.role_id = role.id LEFT JOIN department ON role.department = department.id LEFT JOIN employee AS e2 on e1.manager_id = e2.id;");
}

function findDeptEmployees(departmentID) {
  return pool.query("SELECT e.id, first_name, last_name, department FROM employee as e LEFT JOIN role on e.role_id = role.id WHERE department = $1;", [departmentID])
}

// function to view all roles
function findRoles() {
  return pool.query("SELECT role.id, title, department.name as department, salary FROM role JOIN department ON role.department = department.id");
}

function findDeptRole(roleID) {
  return pool.query("SELECT department FROM role WHERE id = $1;", [roleID]);
}

// function to view all departments
function findDepartments() {
  return pool.query("SELECT * FROM department");
}

function addEmployee(firstName, lastName, employeeRole, employeeManager) {
  return pool.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4);", [firstName, lastName, employeeRole, employeeManager])
}

function addRole(title, salary, deptName) {
  return pool.query("INSERT INTO role (title, salary, department) VALUES ($1, $2, $3)", [title, salary, deptName])
}

function addDepartment(dept) {
  return pool.query("INSERT INTO department (name) VALUES ($1);", [dept]);

  // console.log(`Added ${dept} to the database`)
}

module.exports = {findEmployees, findDeptEmployees, findRoles, findDeptRole, findDepartments, addEmployee, addRole, addDepartment}
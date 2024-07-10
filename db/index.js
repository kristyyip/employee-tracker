const { Console } = require('console');
const { Transform } = require('stream');

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
  pool.query("SELECT e1.id, e1.first_name, e1.last_name, role.title, department.name as department, salary, CONCAT(e2.first_name, ' ', e2.last_name) as manager FROM employee AS e1 LEFT JOIN role ON e1.role_id = role.id LEFT JOIN department ON role.department = department.id LEFT JOIN employee AS e2 on e1.manager_id = e2.id;", (err, {rows}) => {
    return table(rows);
  })
}

// function to view all roles
function findRoles() {
  pool.query("SELECT role.id, title, department.name as department, salary FROM role JOIN department ON role.department = department.id", (err, {rows}) => {
    return table(rows);
  })
}

// function to view all departments
function findDepartments() {
  pool.query("SELECT * FROM department", (err, {rows}) => {
    return table(rows);
  })
}

module.exports = {findEmployees, findRoles, findDepartments}
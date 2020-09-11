const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

// connection info for sql database
const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "12345678",
  database: "employeeTracker_DB"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  start();
});

// function which prompts user to select an action
function start() {
  inquirer.prompt([
    {
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: ["View all employees", "View all employees by department", "View all employees by manager", "Add employee", "Remove employee", "Update employee role", "Update employee manager", "View all roles", "Add role", "Remove role", "View all departments", "Add department", "Remove department", "Exit"]
    }
  ]).then(function (answer) {
    // based on their answer, call corresponding function
    switch (answer.action) {
      case "View all employees":
        queryAllEmployees();
        break;
      case "View all employees by department":
        queryAllEmployeesByDept();
        break;
      case "View all employees by manager":
        queryAllEmployeesByMgr();
        break;
      case "Add employee":
        addEmployee();
        break;
      case "Remove employee":
        removeEmployee();
        break;
      case "Update employee role":
        updateEmployeeRole();
        break;
      case "Update employee manager":
        updateEmployeeMgr();
        break;
      case "View all roles":
        queryAllRoles();
        break;
      case "Add role":
        addRole();
        break;
      case "Remove role":
        removeRole();
        break;
      case "View all departments":
        queryAllDepartments();
        break;
      case "Add department":
        addDepartment();
        break;
      case "Remove department":
        removeDepartment();
        break;
      case "Exit":
        connection.end();
        break;
      default:
        connection.end();
    }
  });
}

function queryAllEmployees() {
  connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, employee.manager_id FROM department INNER JOIN role ON department.id = role.department_id INNER JOIN employee ON role.id = employee.role_id", function (err, res) {
    if (err) throw (err);
    console.table(res);
    start();
  });
}

function queryAllEmployeesByDept() {

}

function queryAllEmployeesByMgr() {

}

function addEmployee() {

}

function removeEmployee() {

}

function updateEmployeeRole() {

}

function updateEmployeeMgr() {

}

function queryAllRoles() {

}

function addRole() {

}

function removeRole() {

}

function queryAllDepartments() {

}

function addDepartment() {

}

function removeDepartment() {

}
const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
const convertMgrIdtoName = require("./helperFuncs");

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

const queryAll = "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, employee.manager_id AS manager FROM department INNER JOIN role ON department.id = role.department_id INNER JOIN employee ON role.id = employee.role_id";

function queryAllEmployees() {
  connection.query(queryAll, function (err, res) {
    if (err) throw (err);
    convertMgrIdtoName(res);
    console.table(res);
    start();
  });
}

function queryAllEmployeesByDept() {
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw (err);
    inquirer.prompt(
      {
        name: "departmentSelection",
        type: "list",
        message: "Which department would you like to view?",
        choices: function () {
          let choiceArray = [];
          for (let i = 0; i < res.length; i++) {
            choiceArray.push(res[i].name);
          }
          return choiceArray;
        }
      }
    ).then(function (answer) {
      connection.query(queryAll + " WHERE department.name = ?", [answer.departmentSelection], function (err, res) {
        if (err) throw (err);
        convertMgrIdtoName(res);
        console.table(res);
        start();
      })
    });
  });
}

function queryAllEmployeesByMgr() {
  connection.query("SELECT * FROM employee", function (err, res) {
    if (err) throw (err);
    inquirer.prompt([
      {
        name: "mgrSelection",
        type: "list",
        message: "Which manager's employees would you like to view?",
        choices: function () {
          let choiceArray = [];
          for (let i = 0; i < res.length; i++) {
            let manager_id = res[i].manager_id;
            if (manager_id !== null) {
              choiceArray.push(res[manager_id - 1].first_name + " " + res[manager_id - 1].last_name);
            }
          }
          return choiceArray;
        }
      }
    ]).then(function (answer) {
      connection.query(queryAll, function (err, res) {
        if (err) throw (err);
        convertMgrIdtoName(res);

        let employeesByMgr = [];

        for(let i = 0; i < res.length; i++) {
          if(res[i].manager === answer.mgrSelection) {
            employeesByMgr.push(res[i]);
          }
        }
        console.table(employeesByMgr);
        start();
      })
    })
  })
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
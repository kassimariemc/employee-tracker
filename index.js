const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
const helperFuncs = require("./helperFuncs");

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
    helperFuncs.convertMgrIdtoName(res);
    console.table(res);
    // return to start function for next action
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
        helperFuncs.convertMgrIdtoName(res);
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
        helperFuncs.convertMgrIdtoName(res);

        let employeesByMgr = [];

        for (let i = 0; i < res.length; i++) {
          if (res[i].manager === answer.mgrSelection) {
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
  connection.query("SELECT role.title FROM role", function (err, res) {
    if (err) throw (err);
    inquirer.prompt([
      {
        name: "firstName",
        type: "input",
        message: "What is the employee's first name?"
      },
      {
        name: "lastName",
        type: "input",
        message: "What is the employee's last name?"
      },
      {
        name: "roleSelection",
        type: "list",
        message: "Which role will the employee have?",
        choices: function () {
          let choiceArray = [];
          for (let i = 0; i < res.length; i++) {
            choiceArray.push(res[i].title);
          }
          return choiceArray;
        }
      },
      {
        name: "mgrSelection",
        type: "list",
        message: "Who will be the employee's manager?",
        choices: function () {
          // NEED TO FIX THIS FUNC, CURRENTLY RETURNS EMPTY ARRAY
          connection.query("SELECT * FROM employee", function (err, res) {
            if (err) throw (err);

            for (let i = 0; i < res.length; i++) {
              let manager_id = res[i].manager_id;
              if (manager_id !== null) {
                choiceArray.push(res[manager_id - 1].first_name + " " + res[manager_id - 1].last_name);
              }
            }
          });
          return choiceArray;
        }
      }
    ])
    .then(function (answers) {
      connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw (err);
        let role;
        for (let i = 0; i < res.length; i++) {
          if (answers.roleSelection === res[i].title) {
            role = res[i].id;
          }
        }
        connection.query("SELECT * FROM employee", function (err, res) {
          if (err) throw (err);
          let mgr;
          let splitName = answers.mgrSelection.split(" ");
          for (let i = 0; i < res.length; i++) {
            if (splitName[0] === res[i].first_name && splitName[1] === res[i].last_name) {
              mgr = res[i].id;
            }
          }
        })
        connection.query("INSERT INTO employee SET ?"),
            {
              first_name: answers.firstName,
              last_name: answers.lastName,
              role_id: role,
              manager_id: mgr
            },
            function (err, res) {
              if (err) throw err;
              console.log("New employee added!");
              start();
            }
      });
    });

  });
}

function removeEmployee() {
  connection.query("SELECT * FROM employee", function(err, res) {
    if (err) throw (err);
    inquirer.prompt([
      {
        name: "empSelection",
        type: "list",
        message: "Which employee would you like to remove?",
        choices: function () {
          let choiceArray = [];
          for (let i = 0; i < res.length; i++) {
            choiceArray.push(res[i].first_name + " " + res[i].last_name);
          }
          return choiceArray;
        }
      }
    ]).then(function(answers) {
      let splitEmp = answers.empSelection.split(" ");
      connection.query("DELETE FROM employee WHERE first_name=? AND last_name=?", [splitEmp[0], splitEmp[1]] 
      , function(err, res) {
        if (err) throw (err);
        console.log("Employee removed!");
        start();
      });
    });
  });
}

function updateEmployeeRole() {

}

function updateEmployeeMgr() {

}

function queryAllRoles() {
  connection.query("SELECT role.id, role.title, role.salary, department.name AS department FROM department INNER JOIN role ON department.id = role.department_id", function (err, res) {
    console.table(res);
    start();
  });
}

function addRole() {
  connection.query("SELECT * FROM department", function(err, res) {
    if (err) throw (err);
    inquirer.prompt([
      {
        name: "roleTitle",
        type: "input",
        message: "What is the name of the new role?"
      },
      {
        name: "roleSalary",
        type: "input",
        message: "What will the salary be?"
      },
      {
        name: "deptSelection",
        type: "list",
        message: "Which department will this role be a part of?",
        choices: function () {
          let choiceArray = [];
          for (let i = 0; i < res.length; i++) {
            choiceArray.push(res[i].name);
          }
          return choiceArray;
        }
      }
    ]).then(function(answers) {
      let dept;
      for(let i = 0; i < res.length; i++) {
        if(answers.deptSelection === res[i].name) {
          dept = res[i].id;
        }
      }
      connection.query("INSERT INTO role SET ?", 
      {
        title: answers.roleTitle,
        salary: answers.roleSalary,
        department_id: dept
      }
      , function(err, res) {
        if (err) throw (err);
        console.log("Role added!");
        start();
      });
    });
  });
}

function removeRole() {
  connection.query("SELECT * FROM role", function(err, res) {
    if (err) throw (err);
    inquirer.prompt([
      {
        name: "roleSelection",
        type: "list",
        message: "Which role would you like to remove?",
        choices: function () {
          let choiceArray = [];
          for (let i = 0; i < res.length; i++) {
            choiceArray.push(res[i].title);
          }
          return choiceArray;
        }
      }
    ]).then(function(answers) {
      connection.query("DELETE FROM role WHERE title=?", [answers.roleSelection] 
      , function(err, res) {
        if (err) throw (err);
        console.log("Role removed!");
        start();
      });
    });
  });
}

function queryAllDepartments() {
  connection.query("SELECT id, name AS department FROM department", function (err, res) {
    console.table(res);
    start();
  });
}

function addDepartment() {
  inquirer.prompt([
    {
      name: "deptName",
      type: "input",
      message: "What is the name of the new department?"
    }
  ]).then(function(answers) {
    connection.query("INSERT INTO department SET ?", 
    {
      name: answers.deptName
    },
    function(err, res) {
      if (err) throw (err);
      console.log("Department added!");
      start();
    })
  })
}

function removeDepartment() {
  connection.query("SELECT * FROM department", function(err, res) {
    if (err) throw (err);
    inquirer.prompt([
      {
        name: "deptSelection",
        type: "list",
        message: "Which department would you like to remove?",
        choices: function () {
          let choiceArray = [];
          for (let i = 0; i < res.length; i++) {
            choiceArray.push(res[i].name);
          }
          return choiceArray;
        }
      }
    ]).then(function(answers) {
      connection.query("DELETE FROM department WHERE name=?", [answers.deptSelection] 
      , function(err, res) {
        if (err) throw (err);
        console.log("Department removed!");
        start();
      });
    });
  });
}
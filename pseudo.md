## pseudo-code
call start function on connection

<!-- DONE -->
### start function
* use inquirer to ask what client would like to do:
  * View all employees
  * View all employees by department
  * View all employees by manager
  * Add employee
  * Remove employee
  * Update employee role
  * Update employee manager
  * View all roles
  * Add role
  * Remove role
  * View all departments
  * Add department
  * Remove department
  * View total utilized budget (BONUS)
.then use switch statement to direct to next corresponding function

<!-- DONE -->
### queryAllEmployees function
* to display employee id, first & last name, title, department, salary, manager
* connection.query
* SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, employee.manager_id
FROM department
INNER JOIN role ON department.id = role.department_id
INNER JOIN employee ON role.id = emplyoee.role_id
* console.table(results)
* need to link manager_id to employee first_name & last_name

<!-- DONE -->
### queryEmployeesByDept function
* use inquirer to ask which department they would like to view
* display departments as choices
const dept = new Department();
dept.getAllDepartments();
* connection.query
* SELECT * FROM department
* choices: function() {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push(results[i].name);
            }
            return choiceArray;
* .then SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, employee.manager_id
FROM department
WHERE name = "inquirer answer" (? maybe goes after ON department_id line)
INNER JOIN role ON department.id = role.department_id
INNER JOIN employee ON role.id = emplyoee.role_id
* console.table(results)

<!-- DONE -->
### queryEmployeesByManager function
* similar to above

<!-- DONE -->
### addEmployee function
* display roles and managers as choices
* connection.query
* SELECT * FROM role
* choices: function() {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push(results[i].title);
            }
            return choiceArray;
* use inqiurer to get first name, last name, role (display choices), manager (display choices)
* .then connection.query("INSERT INTO employee SET ?"), 
{
  first_name: 
  last_name: 
  role_id: 
  manager_id: 
}

<!-- DONE -->
### removeEmployee function
* display employees as choices
* connection.query
* SELECT * FROM employee
* choices: function() {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push(results[i].first_name + results[i].last_name);
            }
            return choiceArray;
* .then connection.query("DELETE FROM employee WHERE ?"),
{
  first_name: 
  last_name: 
}

<!-- TO DO -->
### updateEmployeeRole function
* display employees as choices (same as above)
* then display roles as choices 
* .then connection.query("UPDATE employee SET ? WHERE ?"),
{
  role_id: first SELECT * FROM role to get id
},
{
  id: first SELECT * FROM employee to get id
}

<!-- TO DO -->
### updateEmployeeManager function
* similar to above

<!-- DONE -->
### queryAllRoles and queryAllDepartments function
* connection.query
* SELECT * FROM roles/department
* console.table(results)

<!-- DONE -->
### addRole and addDepartment function
* inquirer to get new role/department, if role then also need salary, and display departments as choices
* connection.query
* INSERT INTO role/department SET ?
{
  title: 
  salary: 
  department_id: first SELECT * FROM department to get id
}

<!-- DONE -->
### removeRole and removeDepartment functions
* inquirer
* display as choices
* connection.query
* DELETE FROM role/department WHERE ?
{
  id: first SELECT * FROM to get id
}

## Classes to set up
### Department class
* (department_id, department_name)
* getDepartmentId, getDepartmentName
### Role class
* (role_id, title, salary, department_id)
* getRoleId, getRoleTitle, getSalary
### Employee class
* (first_name, last_name, role_id, manager_id)
* getEmployeeId, getEmployeeName

class Department (department_id, department_name, connection) {
  this.department_id = department_id;
  this.department_name = department_name;
  this.connection = connection;

  getDepartmentId() {
    <!-- return this.department_id; -->
    return this.connection.query()
  }
}
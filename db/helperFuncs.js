const connection = require("./connection");

class Database {
  constructor(connection) {
    this.connection = connection;
  }

  convertMgrIdtoName = (res) => {
    for (let i = 0; i < res.length; i++) {
      let manager_id = res[i].manager;
      if (manager_id !== null) {
        res[i].manager = res[manager_id - 1].first_name + " " + res[manager_id - 1].last_name;
      }
    }
    return res;
  }

  roleTable = () => {
    return this.connection.query("SELECT * FROM role");
  }



  empTable = () => {
    return this.connection.query("SELECT * FROM employee");
  }


  deptTable = () => {
    return this.connection.query("SELECT * FROM department");
  }

}

module.exports = new Database(connection);
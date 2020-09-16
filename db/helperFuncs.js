const connection = require("./connection");

class Database {
  constructor(connection) {
    this.connection = connection;
  }

  convertMgrIdtoName = (res) => {
    res.forEach(element => {
      for(let i = 0; i < res.length; i++) {
        if(element.manager === res[i].id) {
          element.manager = res[i].first_name + " " + res[i].last_name;
        }
      }
    })
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
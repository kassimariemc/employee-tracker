const convertMgrIdtoName = (res) => {
  for (let i = 0; i < res.length; i++) {
    let manager_id = res[i].manager;
    if (manager_id !== null) {
      res[i].manager = res[manager_id - 1].first_name + " " + res[manager_id - 1].last_name;
    }
  }
  return res;
}

module.exports = {convertMgrIdtoName};
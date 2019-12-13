const mysql = require("mysql");
const inquirer = require("inquirer");
require("console.table");
// const sql = require("./sql");


var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "~Ma009090",
  database: "employeesDB"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  firstPrompt();
});

// function which prompts the user for what action they should take
function firstPrompt() {

  inquirer
    .prompt({
      name: "task",
      type: "list",
      message: "Would you like to do?",
      choices: [
        "View Employees",
        "Add Employee",
        "Remove Employees",
        "Update Employee Role",
        // "View Employees by Department",
        // "View Employees by Manager",
        // "Update Employee Manager",
        "End"]
    })

    .then(function ({ task }) {
      switch (task) {
        case "View Employees":
          viewEmployee();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Remove Employees":
          removeEmployee();
          break;
        // case "Update Employee Manager":
        //   updateEmployeeManager();
        //   break;

        // case "View Employees by Department":
        //   viewEmployeeByDepartment();
        //   break;
        // case "View Employees by Manager":
        //   viewEmployeeByManager();
        //   break;
        case "Update Employee Role":
          updateEmployeeRole();
          break;

        case "End":
          connection.end();
          break;
      }
    });
}

//========================================= READ, SELECT * FROM
function viewEmployee() {
  console.log("Viewing employees\n");

  var query =
    `SELECT e.id, e.first_name, e.last_name, r.title, d.name, r.salary, e.manager_id AS manager
  FROM employee e
  JOIN role r
	ON e.role_id = r.id
  JOIN department d
	ON d.id = r.department_id`

  connection.query(query, function (err, res) {
    if (err) throw err;

    console.table(res);
    console.log("Succeed!\n");

    firstPrompt();
  });
  // console.log(query.sql);
}

//========================================= CREATE: INSERT INTO

function addEmployee() {
  console.log("Inserting an employee!")

  var query =
    `SELECT r.id, r.title, r.salary 
      FROM role r`

  connections.query(query, function (err, res) {
    if (err) throw err;

    const insertRoleChoices = res.map(({ id, title, salary }) => ({
      title: `${title}`, salary: `${salary}`,
      value: id
    }));

    console.table(res);
    console.log("RoleToInsert!");

    promptInsert(promptInsertEmployee);
  });
}

function promptInsert(promptInsertEmployee) {
  inquirer
    .prompt([
      {
        name: "first_name",
        type: "input",
        message: "What is the employee's first name?"
      },
      {
        name: "last_name",
        type: "input",
        message: "What is the employee's last name?"
      },
      {
        name: "role_id",
        type: "list",
        message: "What is the employee's role_id?",
        choices: insertRoleChoices
      },
      // {
      //   name: "manager_id",
      //   type: "list",
      //   message: "What is the employee's manager_id?",
      //   choices: manager
      // }
    ])
    .then(function (answer) {
      console.log("Inserting a new employee");

      // when finished prompting, insert a new item into the db with that info
      connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: answer.first_name,
          last_name: answer.last_name,
          role_id: answer.role_id
        },
        function (err, res) {
          if (err) throw err;

          console.table(res);
          console.log(res.affectedRows + "Inserted successfully!\n");

          firstPrompt();
        });
      // console.log(query.sql);
    });
}


//========================================= DELETE, DELETE FROM

function removeEmployee() {
  console.log("Deleting an employee");

  var query =
    `SELECT e.id, e.first_name, e.last_name
      FROM employee e`

  connection.query(query, function (err, res) {
    if (err) throw err;

    //-----------------------
    // var deleteArrayChoices= [];
    // for (var i = 0; i < deleteArrayChoices.length; i++) {
    //   deleteArrayChoices.push(res[i]);
    // }
    //-----------------------
    const deleteArrayChoices = res.map(({ id, first_name, last_name }) => ({
      id: `${id}`,
      name: `${first_name} ${last_name}`,
      value: id
    }));
    //-----------------------
    // const deleteArrayChoices = query.map(function(????) {
    //   return `${first.name} ${last_name}`, value

    // });
    //-----------------------
    console.table(res);
    console.log("ArrayToDelete!\n");

    promptDelete(deleteArrayChoices);
  });
}

function promptDelete(deleteArrayChoices) {
  inquirer
    .prompt([
      {
        name: "employeeId",
        type: "list",
        message: "Which employee do you want to remove?",
        choices: deleteArrayChoices
      }
    ])
    .then(function (answer) {
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        "DELETE FROM employee WHERE id = ?", { employeeId: answer.employeeId }, function (err, res) {
          if (err) throw err;

          console.table(res);
          console.log(res.affectedRows + "Deleted successfully!\n");

          firstPrompt();
        });
      // console.log(query.sql);
    });
}

//========================================= UPDATE,

function updateEmployeeRole() {
  console.log("Updating an role");

  var query =
    `SELECT r.id, r.title, r.salary 
  FROM role r`

  connection.query(query, function (err, res) {
    if (err) throw err;

    const roleChoices = res.map(({ id, title, salary }) => ({
      title: `${title}`,
      salary: `${salary}`,
      value: id
    }));

    console.table(res);
    console.log("ArrayToUpdate!\n")

    updateEmployeeRole(roleChoices);
  });
}

function updateEmployee() { //????????????????????????????????
  console.log("Updating an employee");

  var query =
    `SELECT e.id, e.first_name, e.last_name, r.title, d.name, r.salary, e.manager_id AS manager
  FROM employee e
  JOIN role r
	ON e.role_id = r.id
  JOIN department d
  ON d.id = r.department_id`

  connection.query(query, function (err, res) {
    if (err) throw err;

    const employeeChoices = res.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id
    }));

    console.table(res);
    console.log("ArrayToUpdate!\n")

    updateEmployeeRole(employeeChoices);
  });
}

function updateEmployeeRole(roleChoices, employeeChoices) {
  inquirer
    .prompt([
      {
        name: "roleId",
        type: "list",
        message: "Which role do you want to update?",
        choices: roleChoices
      },
      {
        name: "employeeId",
        type: "list",
        message: "Which employee do you want to set with the role?",
        choices: employeeChoices
      },
    ])
    .then(function (answer) {

      // when finished prompting, insert a new item into the db with that info
      var query = connection.query(
        "UPDATE employee SET role_id ? WHERE id = ?", [roleId, employeeId], function (err, res) {
          if (err) throw err;

          console.table(res);
          console.log(res.affectedRows + "Updated successfully!");

          firstPrompt();
        });
      // console.log(query.sql);
    });
}






//=========================================
// switch (answer.role_id) {
//   case "Sales Lead":
//     answer.role_id = 1;
//     break;
//   case "Lead Engineer":
//     answer.role_id = 2;
//     break;
//   case "Software Engineer":
//     answer.role_id = 3;
//     break;
//   case "Accountant":
//     answer.role_id = 4;
//     break;
//   case "Legal Team Lead":
//     answer.role_id = 5;
//     break;
// }

// switch (answer.manager_id) {
//   case "John Doe":
//     answer.manager_id = 1;
//     break;
//   case "Mike Chan":
//     answer.manager_id = 2;
//     break;
//   case "Ashley Rodriguez":
//     answer.manager_id = 3;
//     break;
//   case "Kevin Tupik":
//     answer.manager_id = 4;
//     break;
//   case "Malia Brown":
//     answer.manager_id = 5;
//     break;
//   case "Sarah Lourd":
//     answer.manager_id = 6;
//     break;
//   case "Tom Allen":
//     answer.manager_id = 7;
//     break;
//   case "Christian Eckenrode":
//     answer.manager_id = 8;
//     break;
// }
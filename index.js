const mysql = require("mysql");
const inquirer = require("inquirer");
const table = require("console.table");
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
        // "View Employees by Department",
        // "View Employees by Manager",
        "Add Employee",
        "Remove Employees",
        "Update Employee Role",
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
          
        case "Update Employee Manager":
          updateEmployeeManager();
          break;
          
        // case "View Employees by Department":
        //   viewEmployeeByDepartment();
        //   break;

        // case "View Employees by Manager":
        //   viewEmployeeByManager();
        //   break;

        // case "Update Employee Role":
        //   updateEmployeeRole();
        //   break;

        case "End":
          connection.end();
          break;
        }
    });
}

// READ, SELECT * FROM
function viewEmployee() {
  console.log("Viewing employees\n");

  var query = "SELECT e.id, e.first_name, e.last_name, r.title, d.name, r.salary, e.manager_id AS manager";  
  query += "FROM employee e ";
  query += "JOIN role r ";
  query += "ON (e.role_id = r.id) ";
  query += "JOIN department d ";
  query += "ON (d.id = r.department_id)";

  // var query = "SELECT employee.id, employee.first_name, employee.last_name, role.title, d.name, role.salary, employee.manager_id AS manager";  
  // query += "FROM employee ";
  // query += "INNER JOIN role ";
  // query += "ON employee.role_id = role.id ";
  // query += "INNER JOIN department ";
  // query += "ON department.id = role.department_id";

  connection.query(query, function (err, res) {
      if (err) throw err;                    
                          
      table(res);
      console.log("Succeed!\n");

      firstPrompt();
  });
  // console.log(query.sql);
}   

// // CREATE, INSERT INTO
// function addEmployee() {
  
//   inquirer
//     .prompt([
//       {
//         name: "first_name",
//         type: "input",
//         message: "What is the employee's first name?"
//       },
//       {
//         name: "last_name",
//         type: "input",
//         message: "What is the employee's last name?"
//       },
//       {
//         name: "role_id",
//         type: "list",
//         message: "What is the employee's role_id?",
//         choices: [
//           "Sales Lead",
//           "Lead Engineer",
//           "Software Engineer",
//           "Accountant",
//           "Legal Team Lead"]
//       },
//       {
//         name: "manager_id",
//         type: "list",
//         message: "What is the employee's manager_id?",
//         choices: [
//           "Ashley Rodriguez",
//           "Malia Brown",
//           "Sarah Lourd",
//           "Kevin Tupik"]
//       }
//     ])
//     .then(function (answer) {
//       console.log("Inserting a new employee");
//       // when finished prompting, insert a new item into the db with that info
//       var query = connection.query(
//         "INSERT INTO employee SET ?",
//         {
//           fist_name: answer.fist_name,
//           last_name: answer.last_name,
//           role_id: answer.role_id,
//           manager_id: answer.manager_id
//         },
//         function (err, res) {
//           if (err) throw err;
//           console.log(res.affectedRows + "An employee is added successfully!\n");
          
//           firstPrompt();
//         }
//       );
//       console.log(query.sql);
//     });    
// }


// // DELETE, DELETE FROM
// function removeEmployee() {
//   console.log("Deleting a employee");
//   // when finished prompting, insert a new item into the db with that info
//   var query = connection.query(
//     "DELETE FROM employee",

//     function (err, data) {
//       if (err) throw err;
//       console.table(data);
//       console.log(res.affectedRows + "An employee is deleted successfully!\n");

//       firstPrompt();
//     }
//   );
//   console.log(query.sql);
// }   

// //UPDATE, 
// function updateEmployeeManager() {
  
//   inquirer
//     .prompt([
//       {
//         name: "manager_id",
//         type: "list",
//         message: "Which manager do you want to update?",
//         choices: [
//           "Ashley Rodriguez",
//           "Malia Brown",
//           "Sarah Lourd",
//           "Kevin Tupik"]
//       },
//       {
//         name: "EmployeeName",
//         type: "list",
//         message: "Which employee do you want to set with the manager?",
//         choices: [
//           "John Doe",
//           "Mike Chan",
//           "Ashley Rodriguez",
//           "Kevin Tupik",
//           "Malia Brown",
//           "Sarah Lourd",
//           "Tom Allen",
//           "Christian Eckenrode",
//         ]
//       },
//     ])
//     .then(function (answer) {
//       console.log("Updating a manager and a employee");
//       // when finished prompting, insert a new item into the db with that info
//       var query = connection.query(
//         "UPDATE employee SET ? WHERE ?",
//         {
//           manager_id: answer.manager_id,
//         },
//         {
//           fist_name: answer.fist_name,
//           last_name: answer.last_name,
//           title: answer.title,
//           department: answer.department,
//           salary: answer.salary
//         },
//         function (err, res) {
//           if (err) throw err;
//           console.log(res.affectedRows + "A manager is updated successfully!");
          
//           firstPrompt();
//         }
//       );
//       console.log(query.sql);
//     });
// }










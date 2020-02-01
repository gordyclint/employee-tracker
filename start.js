const mysql = require('mysql');
const inquirer = require('inquirer');
const consoleTable = require('console.table');

// create the connection information for the sql database
const connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "Cagman14",
    database: "employee_db"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    console.log("Connection id ", connection.threadId);
    start();
});

function start() {
    inquirer.prompt({
        name: "choice",
        type: "list",
        message: "What would you like to do?",
        choices: ["View All Employees", "View All Employees By Department", "View All Employees By Manager", "Add Employee", "Remove Employee", "Update Employee Role", "Update Employee Manager"]
    }).then(function (answer) {
        if (answer.choice === "View All Employees") {
            viewAll();
        } else if (answer.choice === "View All Employees By Department") {
            allDepartments();
        } else if (answer.choice === "View All Employees By Manager") {
            allManagers();
        } else if (answer.choice === "Add Employee") {
            addEmployee();
        } else if (answer.choice === "Remove Employee") {
            removeEmployee();
        } else if (answer.choice === "Update Employee Role") {
            updateEmployee();
        } else if (answer.choice === "Update Employee Manager") {
            updateManager();
        } else {
            connection.end();
        };
    });
};

function viewAll() {
    connection.query("SELECT * FROM employee", function (err, data) {
        if (err) throw err;
        console.table(data);
        start();
    });
};

function allDepartments() {
    connection.query("SELECT * FROM employee", function (err, data) {
        if (err) throw err;
        console.table(data);
        start();
    });
};

function allManagers() {
    connection.query("SELECT * FROM employee WHERE manager_id is NULL", function (err, data) {
        if (err) throw err;
        console.table(data);
        start();
    });
};

function roleID() {
    let role = [];
    connection.query("SELECT * FROM role", function (err, data) {
        role = data;
        // console.log(data);
        return role;
    });
    return role;
};

function managerID() {
    let manager = [];

    connection.query("SELECT * FROM employee WHERE manager_id IS NULL", function (err, data) {
        manager = data;
        return manager;
    });
    return manager;
};


function addEmployee() {
    let role = roleID(); 
    console.log(role);
    let manager = managerID();

    inquirer.prompt([{
        type: "input",
        message: "What is the employee's first name?",
        name: "first-name"
    },
    {
        type: "input",
        message: "What is the employee's last name?",
        name: "last-name"
    },
    {
        type: "list",
        choices: role,
        name: "role"
    },
    {
        type: "list",
        choices: manager,
        name: "manager"
    }]).then(function (answer) {
        connection.query("INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES(?, ?, ?, ?)", [answer.first - name, answer.last - name, answer.role, answer.manager], function (err, data) {
            start();
        });
    })
};

function removeEmployee() {

};

function updateEmployee() {

};

function updateManager() {

};


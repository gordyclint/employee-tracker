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


function addEmployee() {

    inquirer.prompt([{
        type: "input",
        message: "What is the employee's first name?",
        name: "first_name"
    },
    {
        type: "input",
        message: "What is the employee's last name?",
        name: "last_name"
    },
    {
        name: "role",
        type: "list",
        choices: function () {
            let role = [];
            connection.query("SELECT * FROM role", function (err, data) {
                if (err) throw err;
                for (let i = 0; i < data.length; i++) {
                    role.push(data[i].title);
                    // console.log(data[i].title);
                }
            });
            return role;
        },
        message: "What is the employee's role?"
    },
    {
        type: "list",
        message: "Who is the employee's manager?",
        choices: function () {
            let manager = [];

            connection.query("SELECT * FROM employee WHERE manager_id IS NULL", function (err, data) {
                if (err) throw err;
                manager = data;
            });
            return manager;
        },
        name: "role"
    }
    ]).then(function (answer) {
        connection.query("INSERT INTO employee SET ?",
            {
                first_name: answer.first_name,
                last_name: answer.last_name,
                role_id: answer.role,
                manager_id: answer.manager
            }, function (err, data) {
                if (err) throw err;
                console.log("Your employee was added successfully!");
                viewAll();
                start();
            });
    })
};

function removeEmployee() {
    inquirer.prompt({
        type: "list",
        message: "Which employee would you like to remove?",
        choices: [],
        name: "remove"
    })

};

function updateEmployee() {

};

function updateManager() {

};


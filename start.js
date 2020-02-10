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
    password: "Cagman14B0nghole",
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


function LookupRoles() {
    return new Promise(function (resolve, reject) {
        let connectionQuery = "SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id";
        connection.query(connectionQuery, function (err, data) {
            resolve(data);
        });
    });
};

function LookupManager() {
    return new Promise(function (resolve, reject) {
        connection.query("SELECT * FROM employee WHERE manager_id is NULL", function (err, data) {
            resolve(data);
        });
    });
};

function LookupEmployee() {
    return new Promise(function (resolve, reject) {
        connection.query("SELECT * FROM employee", function (err, data) {
            resolve(data);
        });
    });
};



function addEmployee() {
    let roles = [];
    let managers = [];
    LookupRoles().then(function (data) {
        roles = data.map(data => {
            return data.id + " " + data.title
        });

        LookupManager().then(function (data) {
            managers = data.map(data => {
                return data.id + " " + data.first_name + " " + data.last_name
            });

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

                type: "list",
                message: "What is the employee's role?",
                choices: roles,
                name: "role"
            },
            {

                type: "list",
                message: "What is the employee's Manager?",
                choices: managers,
                name: "manager"
            }
            ]).then(function (answer) {
                connection.query("INSERT INTO employee SET ?",
                    {
                        first_name: answer.first_name,
                        last_name: answer.last_name,
                        role_id: answer.role.split(" ")[0],
                        manager_id: answer.manager.split(" ")[0]
                    }, function (err, data) {
                        if (err) throw err;
                        console.log("Your employee was added successfully!");
                        viewAll();
                        start();
                    });
            });
        });
    });
};

function removeEmployee() {
    let employees = [];
    LookupEmployee().then(function (data) {
        employees = data.map(data => {
            return data.id + " " + data.first_name + " " + data.last_name
        });

        inquirer.prompt({
            type: "list",
            message: "Which employee would you like to remove?",
            choices: employees,
            name: "remove"
        }).then(function (answer) {
            let connectionQuery = 'DELETE FROM employee WHERE ?';
            connection.query(connectionQuery,
                {
                    id: answer.remove.split(" ")[0]
                }, function (err, data) {
                    if (err) throw err;
                    console.log('Your employee was deleted successfully!');
                    viewAll();
                    start();
                });
        });
    });
};


function updateEmployee() {
    let employees = [];
    let roles = [];
    LookupEmployee().then(function (data) {
        employees = data.map(data => {
            return data.id + " " + data.first_name + " " + data.last_name
        });
        LookupRoles().then(function (data) {
            roles = data.map(data => {
                return data.id + " " + data.title
            });

            inquirer.prompt([
                {
                    type: "list",
                    message: "Which employee would you like to update?",
                    choices: employees,
                    name: "update"
                },
                {
                    type: "list",
                    message: "Which role is the employee in now?",
                    choices: roles,
                    name: "roles"
                }
            ]).then(function (answer) {
                let connectionQuery = "UPDATE employees WHERE ?";
                connection.query(connectionQuery,
                    {
                        id: answer.update.split(" ")[0],
                        role_id: answer.roles.split(" ")[0]
                    }, function (err, data) {
                        if (err) throw err;
                        console.log('Your employee was updated successfully!');
                        viewAll();
                        start();
                    });
            });
        });
    });
}

function updateManager() {
    let managers = [];
    LookupManager().then(function (data) {
        managers = data.map(data => {
            return data.id + " " + data.first_name + " " + data.last_name
        });
        inquirer.prompt({
            type: "list",
            message: "Which manager would you like to update?",
            choices: managers,
            name: "manager"
        }).then(function (answer) {
            connection.query("UPDATE managers WHERE manager_id is NULL",
                function (err, data) {
                    if (err) throw err;
                    console.log('Your employee was updated successfully!');
                    viewAll();
                    start();
                });
        });
    });
};



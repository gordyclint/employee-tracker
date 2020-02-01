USE employee_db;

INSERT INTO department (name)
VALUES("Engineering"), ("Sales"), ("Finance"), ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES("Engineering Lead", 150000, 1), ("Software Engineer", 100000, 1), ("Sales Lead", 75000, 2), ("Salesperson", 50000, 2), ("Lead Accountant", 100000, 3), ("Accountant", 75000, 3), ("Legal Partner", 200000, 4), ("Legal", 125000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES("John", "Doe", 2, 3), ("Mike", "Chan", 2, 1), ("Ashley", "Rodriguez", 1, NULL), ("Kevin", "Tupnik", 1, 3), ("Malia", "Brown", 3, NULL), ("Sarah", "Lourd", 4, NULL), ("Tom", "Allen", 4, 6);
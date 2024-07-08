INSERT INTO department (name)
VALUES 
    ('Finance'),
    ('Marketing'),
    ('Sales'),
    ('Engineering'),
    ('Product');


INSERT INTO role (title, salary, department)
VALUES
    ('Accountant', 100000, 1),
    ('Financial Analyst', 90000, 1),
    ('Marketing Analyst', 60000, 2),
    ('Account Manager', 100000, 3),
    ('Sales Representative', 50000, 3),
    ('Principal Engineer', 150000, 4),
    ('Engineer', 120000, 4),
    ('Product Manager', 90000, 5);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('John', 'Smith', 1, NULL),
    ('Jane', 'Doe', 2, NULL),
    ('Sarah', 'McDonald', 3, NULL),
    ('Michael', 'Anderson', 4, NULL),
    ('Caroline', 'Liu', 6, NULL),
    ('Christopher', 'Manning', 8, NULL);

-- insert into employee table again so the employee id exists for managers
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
    ('Andrew', 'Peterson', 5, 4),
    ('Mindy', 'Young', 7, 5),
    ('Ted', 'Roland', 7, 5);
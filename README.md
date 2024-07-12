# Module 12: SQL / Employee Tracker

## Description
This is the challenge for Module 12 of the coding bootcamp. This is a command-line application that allows a user to manage a company's employee database by letting them view and add their employees, roles, and departments, as well as update and employee's role.

### User Story
```
AS A business owner
I WANT to be able to view and manage the departments, roles, and employees in my company
SO THAT I can organize and plan my business
```

### Acceptance Criteria
```
GIVEN a command-line application that accepts user input
WHEN I start the application
THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
WHEN I choose to view all departments
THEN I am presented with a formatted table showing department names and department ids
WHEN I choose to view all roles
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
WHEN I choose to view all employees
THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
WHEN I choose to add a department
THEN I am prompted to enter the name of the department and that department is added to the database
WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
WHEN I choose to update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database
```

## Application
You can see how the project works [here](https://drive.google.com/file/d/1moukppt6sa5kCogjhrN7CrnTkKhZpblx/view?usp=sharing).

The user will be prompted to select an action.
![Command Line](assets/cli.png)

They have the ability to view employees, roles, and departments.
![View](assets/view.png)

They can also add new employees, roles, and departments.
![Add](assets/add.png)
![Added employee, role, department](assets/added.png)

They can make updates to an employee as well.
![Update](assets/update.png)
![Updated employee](assets/updated-employee.png)

## Citations
Aleksandar (2022). "How to get index value of choice made with Inquirer?". https://stackoverflow.com/questions/65415706/how-to-get-index-value-of-choice-made-with-inquirer. (index.js)

Brickshot (2021). "Remove index from console.table()." https://stackoverflow.com/questions/49618069/remove-index-from-console-table. (index.js)

Gathu, Boswell (2019). "Conditional Prompt rendering in Inquirer?" https://stackoverflow.com/questions/56412516/conditional-prompt-rendering-in-inquirer. (index.js)

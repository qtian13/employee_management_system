# Employee Management System
This application is to create content management systems (CMS) that allows non-developers to easily view and interact with information stored in databases to manage a company's employee database

## Table of Contents
* [Installation](#installation)
* [Built With](#built-with)
* [Features](#features)
* [Demo Video](#demo-video)
* [Demo GIF](#demo-gif)
* [Author](#author)
* [Questions](#questions)
* [Acknowledgments](#acknowledgments)

## Installation
```console
git clone https://github.com/qtian13/employee_management_system.git
npm init -y
npm i console.table
npm i inquirer
npm i mysql2
node server.js
```
## Built With
* [JavaScript](https://www.javascript.com/)
* [NodeJS](https://nodejs.org/en/)
* [npm](https://www.npmjs.com/)

## Features
* User can view and manage the departments, roles, and employees in their company to organize and plan their business
* When user start the application, they are presented with the following options: `view all departments`, `view all roles`, `view all employees`, `view all employees by department`, `view all employees by manager`, `add a department`, `add a role`, `add an employee`, `update an employee role`, `update an employee manager`, `remove an employee`, `remove a role`, `remove a department`, `calculate utilized budget by department`

* About employee database
    * When user choose to `view all employees`, they are presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
    * When user choose to `view all employees by department`, they are prompted to select a department before presented with a formatted table showing employee data in that department, including details as above
    * When user choose to `view all employees by manager`, they are prompted to select a manager before presented with a formatted table showing data of employees reports to that manager, including details as above
    * When user choose to `add an employee`, then they are prompted to enter the employee’s first name, last name, select a role and employee's manager, and that employee is added to the database
    * When user choose to `update an employee role`, then they are prompted to select an employee to update and their new role and this information is updated in the database 
    * When user choose to `update an employee manager`, then they are prompted to select an employee to update and their new manager and this information is updated in the database
    * When user choose to `remove an employee`, then they are prompted to select an employee to delete this employee's data in the database
* About role database
    * When user choose to `view all roles`, they are presented with the job title, role id, the department that role belongs to, and the salary for that role
    * When user choose to `add a role`, they are prompted to enter the name, salary and select a department for the role before this new role is added to the database
    * When user choose to `remove a role`, then they are prompted to select a role to delete the role's data from in the database
* About department database
    * When user choose to `view all departments`, they are presented with a formatted table showing department names and department ids
    * When user choose to `add a department`, they are prompted to enter the name of the department and that department is added to the database
    * When user choose to `remove a department`, then they are prompted to select a department to delete the department's data from in the database
* About budget database
    * When user choose to `calculate utilized budget by department`, then they are presented with a formatted table showing department names and the combined salaries of all employees in that department


## Demo Video
Demo Video: []()

## Demo GIF
![Employee Management System](assets/images/demo.gif)

## Author
Qiushuang Tian
- [Link to Portfolio Site](https://qtian13.github.io/myPortfolio/)
- [Link to Github](https://github.com/qtian13)
- [Link to LinkedIn](https://www.linkedin.com/in/qiushuang-tian-a9754248/)

## Questions
Please reach me out with additional questions!

Emails: qiushuang.tian@gmail.com

## Acknowledgments
- [Berkeley Coding Boot Camp](https://bootcamp.berkeley.edu/coding/) provided mock up image







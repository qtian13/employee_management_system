DROP DATABASE IF EXISTS employee_management_system;
CREATE DATABASE employee_management_system;

USE employee_management_system;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);
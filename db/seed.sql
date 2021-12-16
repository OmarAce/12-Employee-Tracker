USE employees_db;

INSERT into departments (name) VALUES ("Sales");
INSERT into departments (name) VALUES ("IT");
INSERT into departments (name) VALUES ("Legal");
INSERT into departments (name) VALUES ("HR");

INSERT into roles (title, salary, department_id) VALUES ("Sales Manager", 100000, 1);
INSERT into roles (title, salary, department_id) VALUES ("Sales person", 50000, 1);
INSERT into roles (title, salary, department_id) VALUES ("IT Manager", 100000, 2);
INSERT into roles (title, salary, department_id) VALUES ("Engineer", 900000, 2);
INSERT into roles (title, salary, department_id) VALUES ("Legal Manager", 100000, 3);
INSERT into roles (title, salary, department_id) VALUES ("Legal Team Member", 30000, 3);
INSERT into roles (title, salary, department_id) VALUES ("Legal Lawyer", 30000, 3);
INSERT into roles (title, salary, department_id) VALUES ("Legal Consultant", 30000, 3);
INSERT into roles (title, salary, department_id) VALUES ("Counselor", 80000, 4);

INSERT into employees (first_name, last_name, role_id, manager_id) VALUES ("John H.", "Patterson", 1, null);
INSERT into employees (first_name, last_name, role_id, manager_id) VALUES ("Mary Kay", "Ash", 2, 1);
INSERT into employees (first_name, last_name, role_id, manager_id) VALUES ("Dale", "Carnegie", 2, 1);

INSERT into employees (first_name, last_name, role_id, manager_id) VALUES ("Montgomery", "Scott", 3, null);
INSERT into employees (first_name, last_name, role_id, manager_id) VALUES ("Angus", "MacGyver", 4, 3);
INSERT into employees (first_name, last_name, role_id, manager_id) VALUES ("Kaylee", "Frye", 4, 3);
INSERT into employees (first_name, last_name, role_id, manager_id) VALUES ("Cyrus", "Smith", 4, 3);

INSERT into employees (first_name, last_name, role_id, manager_id) VALUES ("Bob", "The-Minion", 5, null);
INSERT into employees (first_name, last_name, role_id, manager_id) VALUES ("Bob", "Ross", 6, 5);
INSERT into employees (first_name, last_name, role_id, manager_id) VALUES ("Bob", "Marley", 7, 5);
INSERT into employees (first_name, last_name, role_id, manager_id) VALUES ("Bob", "Dylan", 7, 5);
INSERT into employees (first_name, last_name, role_id, manager_id) VALUES ("Bob", "Hope", 8, 5);

INSERT into employees (first_name, last_name, role_id, manager_id) VALUES ("Deanna", "Troi", 9, null);
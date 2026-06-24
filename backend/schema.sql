CREATE DATABASE IF NOT EXISTS project_solovers;
USE project_solovers;

-- Admin Table
CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('super_admin', 'admin') DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Employees Table
CREATE TABLE employees (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    department VARCHAR(50),
    designation VARCHAR(100),
    joining_date DATE,
    blood_group VARCHAR(5),
    address TEXT,
    project VARCHAR(100),
    reporting_manager VARCHAR(100),
    status ENUM('Active', 'On Leave', 'Inactive') DEFAULT 'Active',
    progress INT DEFAULT 0,
    attendance DECIMAL(5,2) DEFAULT 0,
    tasks_completed INT DEFAULT 0,
    tasks_pending INT DEFAULT 0,
    performance DECIMAL(3,1) DEFAULT 0,
    work_hours DECIMAL(5,2) DEFAULT 0,
    check_in VARCHAR(20),
    check_out VARCHAR(20),
    image LONGTEXT,
    is_first_login TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Attendance Table
CREATE TABLE attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(20) NOT NULL,
    date DATE NOT NULL,
    check_in VARCHAR(20),
    check_out VARCHAR(20),
    hours DECIMAL(5,2) DEFAULT 0,
    status ENUM('Present', 'Late', 'Absent', 'On Leave') DEFAULT 'Present',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    UNIQUE KEY unique_attendance (employee_id, date)
);

-- Projects Table
CREATE TABLE projects (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    manager VARCHAR(100),
    start_date DATE,
    deadline DATE,
    status ENUM('Not Started', 'In Progress', 'Completed', 'On Hold') DEFAULT 'Not Started',
    priority ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
    completion INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Project Team (many-to-many)
CREATE TABLE project_team (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id VARCHAR(20) NOT NULL,
    employee_id VARCHAR(20) NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    UNIQUE KEY unique_assignment (project_id, employee_id)
);

-- Reports Table
CREATE TABLE reports (
    id VARCHAR(20) PRIMARY KEY,
    employee_id VARCHAR(20) NOT NULL,
    employee_name VARCHAR(100),
    project VARCHAR(200),
    date DATE,
    work_done TEXT,
    pending_work TEXT,
    blockers TEXT,
    tasks_completed INT DEFAULT 0,
    tasks_pending INT DEFAULT 0,
    working_hours DECIMAL(5,2) DEFAULT 0,
    progress INT DEFAULT 0,
    tomorrow_plan TEXT,
    manager_comments TEXT,
    status ENUM('Submitted', 'Pending', 'Approved', 'Rejected') DEFAULT 'Submitted',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- Notifications Table
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(20) NOT NULL,
    user_type ENUM('admin', 'employee') NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT,
    type ENUM('info', 'success', 'warning', 'error') DEFAULT 'info',
    is_read TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Password Reset OTPs
CREATE TABLE password_reset_otps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    otp VARCHAR(6) NOT NULL,
    is_verified TINYINT(1) DEFAULT 0,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact Messages
CREATE TABLE contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    subject VARCHAR(200),
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Default Admin
INSERT INTO admins (name, email, password, role) VALUES
('Super Admin', 'admin@projectsolovers.com', '$2b$10$DefaultAdminHashWillBeReplaced', 'super_admin');

-- Insert Sample Employees
INSERT INTO employees (id, name, email, password, phone, department, designation, joining_date, blood_group, address, project, reporting_manager, status, progress, attendance, tasks_completed, tasks_pending, performance, work_hours, check_in, check_out) VALUES
('EMP001', 'Rajesh Kumar', 'rajesh.kumar@projectsolovers.com', '$2b$10$SampleHashWillBeReplaced', '+91 9876543210', 'Software Development', 'Senior Developer', '2023-01-15', 'O+', 'Hyderabad, India', 'Project Alpha', 'Admin', 'Active', 85, 95.00, 42, 8, 4.5, 8.5, '09:00 AM', '06:00 PM'),
('EMP002', 'Priya Sharma', 'priya.sharma@projectsolovers.com', '$2b$10$SampleHashWillBeReplaced', '+91 9876543211', 'UI/UX Design', 'UI/UX Designer', '2023-02-01', 'A+', 'Hyderabad, India', 'Project Beta', 'Admin', 'Active', 72, 90.00, 28, 12, 4.0, 8.0, '09:15 AM', '05:45 PM'),
('EMP003', 'Amit Patel', 'amit.patel@projectsolovers.com', '$2b$10$SampleHashWillBeReplaced', '+91 9876543212', 'Web Development', 'Full Stack Developer', '2023-03-10', 'B+', 'Hyderabad, India', 'Project Alpha', 'Admin', 'Active', 90, 98.00, 35, 5, 4.8, 9.0, '08:45 AM', '06:15 PM'),
('EMP004', 'Sneha Reddy', 'sneha.reddy@projectsolovers.com', '$2b$10$SampleHashWillBeReplaced', '+91 9876543213', 'Data Analytics', 'Data Analyst', '2023-04-05', 'AB+', 'Hyderabad, India', 'Project Gamma', 'Admin', 'Active', 65, 85.00, 20, 15, 3.5, 7.5, '09:30 AM', '05:30 PM'),
('EMP005', 'Vikram Singh', 'vikram.singh@projectsolovers.com', '$2b$10$SampleHashWillBeReplaced', '+91 9876543214', 'Artificial Intelligence', 'ML Engineer', '2023-05-20', 'O-', 'Hyderabad, India', 'Project Delta', 'Admin', 'Active', 78, 92.00, 30, 10, 4.2, 8.5, '09:00 AM', '06:00 PM'),
('EMP006', 'Ananya Gupta', 'ananya.gupta@projectsolovers.com', '$2b$10$SampleHashWillBeReplaced', '+91 9876543215', 'Marketing', 'Marketing Lead', '2023-06-15', 'B-', 'Hyderabad, India', 'Project Beta', 'Admin', 'Active', 70, 88.00, 25, 10, 3.8, 8.0, '09:15 AM', '05:45 PM'),
('EMP007', 'Rohit Verma', 'rohit.verma@projectsolovers.com', '$2b$10$SampleHashWillBeReplaced', '+91 9876543216', 'Finance', 'Finance Manager', '2023-07-01', 'A-', 'Hyderabad, India', 'Not assigned', 'Admin', 'Active', 60, 82.00, 18, 12, 3.2, 7.5, '09:30 AM', '05:30 PM'),
('EMP008', 'Neha Joshi', 'neha.joshi@projectsolovers.com', '$2b$10$SampleHashWillBeReplaced', '+91 9876543217', 'Quality Assurance', 'QA Lead', '2023-08-10', 'AB-', 'Hyderabad, India', 'Project Alpha', 'Admin', 'Active', 82, 94.00, 38, 7, 4.3, 8.5, '09:00 AM', '06:00 PM'),
('EMP009', 'Arjun Nair', 'arjun.nair@projectsolovers.com', '$2b$10$SampleHashWillBeReplaced', '+91 9876543218', 'Human Resources', 'HR Manager', '2023-09-05', 'O+', 'Hyderabad, India', 'Not assigned', 'Admin', 'Active', 55, 90.00, 15, 10, 3.0, 8.0, '09:15 AM', '05:45 PM'),
('EMP010', 'Divya Menon', 'divya.menon@projectsolovers.com', '$2b$10$SampleHashWillBeReplaced', '+91 9876543219', 'Administration', 'Admin Executive', '2023-10-01', 'B+', 'Hyderabad, India', 'Not assigned', 'Admin', 'On Leave', 45, 75.00, 12, 8, 2.8, 7.0, '09:30 AM', '05:30 PM');

-- Insert Sample Projects
INSERT INTO projects (id, name, manager, start_date, deadline, status, priority, completion) VALUES
('PRJ001', 'Project Alpha', 'Admin', '2024-01-01', '2024-06-30', 'In Progress', 'High', 75),
('PRJ002', 'Project Beta', 'Admin', '2024-02-01', '2024-08-31', 'In Progress', 'Medium', 60),
('PRJ003', 'Project Gamma', 'Admin', '2024-03-01', '2024-09-30', 'Not Started', 'Low', 0),
('PRJ004', 'Project Delta', 'Admin', '2024-01-15', '2024-05-15', 'Completed', 'High', 100),
('PRJ005', 'Project Epsilon', 'Admin', '2024-04-01', '2024-10-31', 'On Hold', 'Medium', 30);

-- Assign Team Members
INSERT INTO project_team (project_id, employee_id) VALUES
('PRJ001', 'EMP001'), ('PRJ001', 'EMP003'), ('PRJ001', 'EMP008'),
('PRJ002', 'EMP002'), ('PRJ002', 'EMP006'),
('PRJ003', 'EMP004'),
('PRJ004', 'EMP001'), ('PRJ004', 'EMP005'),
('PRJ005', 'EMP005'), ('PRJ005', 'EMP004');

-- Insert Sample Attendance
INSERT INTO attendance (employee_id, date, check_in, check_out, hours, status) VALUES
('EMP001', CURDATE(), '09:00 AM', '06:00 PM', 8.5, 'Present'),
('EMP002', CURDATE(), '09:15 AM', '05:45 PM', 8.0, 'Present'),
('EMP003', CURDATE(), '08:45 AM', '06:15 PM', 9.0, 'Present'),
('EMP004', CURDATE(), '09:30 AM', '05:30 PM', 7.5, 'Late'),
('EMP005', CURDATE(), '09:00 AM', '06:00 PM', 8.5, 'Present'),
('EMP006', CURDATE(), '09:15 AM', '05:45 PM', 8.0, 'Present'),
('EMP007', CURDATE(), '09:30 AM', '05:30 PM', 7.5, 'Present'),
('EMP008', CURDATE(), '09:00 AM', '06:00 PM', 8.5, 'Present'),
('EMP009', CURDATE(), NULL, NULL, 0, 'Absent'),
('EMP010', CURDATE(), NULL, NULL, 0, 'On Leave');

-- Insert Sample Reports
INSERT INTO reports (id, employee_id, employee_name, project, date, work_done, tasks_completed, tasks_pending, working_hours, progress, manager_comments, status) VALUES
('RPT001', 'EMP001', 'Rajesh Kumar', 'Project Alpha', CURDATE(), 'Completed API integration, fixed bugs in authentication module', 5, 2, 8.5, 85, 'Excellent progress', 'Approved'),
('RPT002', 'EMP002', 'Priya Sharma', 'Project Beta', CURDATE(), 'Designed new dashboard mockups, updated style guide', 3, 1, 8.0, 72, 'Good design work', 'Approved'),
('RPT003', 'EMP003', 'Amit Patel', 'Project Alpha', CURDATE(), 'Deployed frontend build, optimized database queries', 4, 1, 9.0, 90, 'Outstanding', 'Approved');

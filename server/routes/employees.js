const express = require('express');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

const employees = [
    { id: 'EMP001', name: 'Rajesh Kumar', email: 'rajesh.kumar@company.com', phone: '+91 9876543210', department: 'Software Development', designation: 'Senior Software Engineer', joining_date: '2020-03-15', blood_group: 'O+', address: '123, MG Road, Bangalore', project: 'Project Phoenix', reporting_manager: 'Amit Sharma', status: 'Active', progress: 92, attendance: 98, tasks_completed: 145, tasks_pending: 5, performance: 4.8, work_hours: 8.5, check_in: '09:00 AM', check_out: '06:30 PM' },
    { id: 'EMP002', name: 'Priya Sharma', email: 'priya.sharma@company.com', phone: '+91 9876543211', department: 'Web Development', designation: 'Full Stack Developer', joining_date: '2021-06-01', blood_group: 'A+', address: '456, Brigade Road, Bangalore', project: 'Project Atlas', reporting_manager: 'Sneha Patel', status: 'Active', progress: 85, attendance: 95, tasks_completed: 98, tasks_pending: 8, performance: 4.5, work_hours: 8.0, check_in: '09:15 AM', check_out: '06:00 PM' },
    { id: 'EMP003', name: 'Amit Patel', email: 'amit.patel@company.com', phone: '+91 9876543212', department: 'UI/UX Design', designation: 'UI/UX Designer', joining_date: '2022-01-10', blood_group: 'B+', address: '789, Indiranagar, Bangalore', project: 'Project Zenith', reporting_manager: 'Neha Gupta', status: 'Active', progress: 78, attendance: 92, tasks_completed: 67, tasks_pending: 12, performance: 4.2, work_hours: 7.5, check_in: '09:30 AM', check_out: '05:45 PM' },
    { id: 'EMP004', name: 'Sneha Reddy', email: 'sneha.reddy@company.com', phone: '+91 9876543213', department: 'Data Analytics', designation: 'Data Analyst', joining_date: '2021-11-20', blood_group: 'AB+', address: '321, Koramangala, Bangalore', project: 'Project DataStream', reporting_manager: 'Vikram Singh', status: 'Active', progress: 70, attendance: 88, tasks_completed: 55, tasks_pending: 15, performance: 3.8, work_hours: 8.0, check_in: '09:00 AM', check_out: '06:00 PM' },
    { id: 'EMP005', name: 'Vikram Singh', email: 'vikram.singh@company.com', phone: '+91 9876543214', department: 'Artificial Intelligence', designation: 'AI Engineer', joining_date: '2020-08-05', blood_group: 'O-', address: '567, Whitefield, Bangalore', project: 'Project NeuralNet', reporting_manager: 'Rajesh Kumar', status: 'Active', progress: 95, attendance: 99, tasks_completed: 120, tasks_pending: 3, performance: 4.9, work_hours: 9.0, check_in: '08:45 AM', check_out: '07:00 PM' },
    { id: 'EMP006', name: 'Neha Gupta', email: 'neha.gupta@company.com', phone: '+91 9876543215', department: 'Human Resources', designation: 'HR Manager', joining_date: '2019-04-01', blood_group: 'A-', address: '890, JP Nagar, Bangalore', project: 'Project TalentHub', reporting_manager: 'Amit Sharma', status: 'Active', progress: 88, attendance: 96, tasks_completed: 82, tasks_pending: 6, performance: 4.6, work_hours: 8.0, check_in: '09:00 AM', check_out: '06:00 PM' },
    { id: 'EMP007', name: 'Arjun Nair', email: 'arjun.nair@company.com', phone: '+91 9876543216', department: 'Marketing', designation: 'Marketing Lead', joining_date: '2021-02-15', blood_group: 'B-', address: '234, Electronic City, Bangalore', project: 'Project BrandBoost', reporting_manager: 'Priya Sharma', status: 'Active', progress: 75, attendance: 90, tasks_completed: 45, tasks_pending: 10, performance: 4.0, work_hours: 7.5, check_in: '09:30 AM', check_out: '05:30 PM' },
    { id: 'EMP008', name: 'Divya Menon', email: 'divya.menon@company.com', phone: '+91 9876543217', department: 'Finance', designation: 'Finance Analyst', joining_date: '2022-06-01', blood_group: 'AB-', address: '678, Jayanagar, Bangalore', project: 'Project FinTrack', reporting_manager: 'Neha Gupta', status: 'Active', progress: 65, attendance: 85, tasks_completed: 35, tasks_pending: 18, performance: 3.5, work_hours: 7.0, check_in: '09:45 AM', check_out: '05:15 PM' },
    { id: 'EMP009', name: 'Rohan Desai', email: 'rohan.desai@company.com', phone: '+91 9876543218', department: 'Quality Assurance', designation: 'QA Lead', joining_date: '2020-09-12', blood_group: 'O+', address: '432, BTM Layout, Bangalore', project: 'Project QualityFirst', reporting_manager: 'Vikram Singh', status: 'Active', progress: 82, attendance: 93, tasks_completed: 110, tasks_pending: 7, performance: 4.3, work_hours: 8.0, check_in: '09:00 AM', check_out: '06:00 PM' },
    { id: 'EMP010', name: 'Kavita Joshi', email: 'kavita.joshi@company.com', phone: '+91 9876543219', department: 'Administration', designation: 'Admin Officer', joining_date: '2018-07-01', blood_group: 'A+', address: '901, Malleshwaram, Bangalore', project: 'Project OfficeOps', reporting_manager: 'Rajesh Kumar', status: 'Active', progress: 90, attendance: 97, tasks_completed: 95, tasks_pending: 4, performance: 4.7, work_hours: 8.5, check_in: '08:30 AM', check_out: '06:30 PM' },
    { id: 'EMP011', name: 'Suresh Iyer', email: 'suresh.iyer@company.com', phone: '+91 9876543220', department: 'Software Development', designation: 'Junior Developer', joining_date: '2023-01-10', blood_group: 'B+', address: '543, HSR Layout, Bangalore', project: 'Project Phoenix', reporting_manager: 'Rajesh Kumar', status: 'Active', progress: 45, attendance: 82, tasks_completed: 22, tasks_pending: 20, performance: 3.2, work_hours: 7.0, check_in: '09:30 AM', check_out: '05:30 PM' },
    { id: 'EMP012', name: 'Ananya Verma', email: 'ananya.verma@company.com', phone: '+91 9876543221', department: 'Web Development', designation: 'Frontend Developer', joining_date: '2022-09-15', blood_group: 'O+', address: '765, Marathahalli, Bangalore', project: 'Project Atlas', reporting_manager: 'Sneha Patel', status: 'Active', progress: 55, attendance: 87, tasks_completed: 38, tasks_pending: 16, performance: 3.6, work_hours: 7.5, check_in: '09:15 AM', check_out: '05:45 PM' },
    { id: 'EMP013', name: 'Manish Tiwari', email: 'manish.tiwari@company.com', phone: '+91 9876543222', department: 'Data Analytics', designation: 'Data Engineer', joining_date: '2021-12-01', blood_group: 'AB+', address: '210, Yelahanka, Bangalore', project: 'Project DataStream', reporting_manager: 'Sneha Reddy', status: 'On Leave', progress: 60, attendance: 78, tasks_completed: 42, tasks_pending: 14, performance: 3.7, work_hours: 7.0, check_in: '09:00 AM', check_out: '05:00 PM' },
    { id: 'EMP014', name: 'Pooja Mehta', email: 'pooja.mehta@company.com', phone: '+91 9876543223', department: 'Artificial Intelligence', designation: 'ML Engineer', joining_date: '2022-03-20', blood_group: 'A-', address: '876, Hebbal, Bangalore', project: 'Project NeuralNet', reporting_manager: 'Vikram Singh', status: 'Active', progress: 72, attendance: 91, tasks_completed: 58, tasks_pending: 11, performance: 4.1, work_hours: 8.0, check_in: '09:00 AM', check_out: '06:00 PM' }
];

router.get('/', authenticateToken, (req, res) => {
    res.json(employees);
});

router.get('/:id', authenticateToken, (req, res) => {
    const emp = employees.find(e => e.id === req.params.id);
    if (!emp) return res.status(404).json({ message: 'Employee not found' });
    res.json(emp);
});

router.post('/', authenticateToken, (req, res) => {
    const newEmp = {
        id: 'EMP' + String(employees.length + 1).padStart(3, '0'),
        ...req.body,
        status: 'Active',
        progress: 0,
        attendance: 100,
        tasks_completed: 0,
        tasks_pending: 0,
        performance: 3.0,
        work_hours: 8.0,
        check_in: '09:00 AM',
        check_out: '06:00 PM'
    };
    employees.push(newEmp);
    res.status(201).json({ message: 'Employee created', employee: newEmp });
});

router.put('/:id', authenticateToken, (req, res) => {
    const idx = employees.findIndex(e => e.id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Employee not found' });
    employees[idx] = { ...employees[idx], ...req.body };
    res.json({ message: 'Employee updated', employee: employees[idx] });
});

router.delete('/:id', authenticateToken, (req, res) => {
    const idx = employees.findIndex(e => e.id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Employee not found' });
    employees.splice(idx, 1);
    res.json({ message: 'Employee deleted' });
});

router.post('/:id/photo', authenticateToken, (req, res) => {
    res.json({ message: 'Photo uploaded', image: null });
});

router.get('/:id/photo', authenticateToken, (req, res) => {
    res.json({ image: null });
});

module.exports = router;

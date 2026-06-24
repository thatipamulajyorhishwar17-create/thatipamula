const CompanyData = {
    departments: [
        'Administration',
        'Human Resources',
        'Software Development',
        'Web Development',
        'UI/UX Design',
        'Data Analytics',
        'Artificial Intelligence',
        'Marketing',
        'Finance',
        'Quality Assurance'
    ],
    employees: [
        {
            id: 'EMP001',
            name: 'Rajesh Kumar',
            email: 'rajesh.kumar@company.com',
            password: 'emp@001',
            phone: '+91 9876543210',
            department: 'Software Development',
            designation: 'Senior Software Engineer',
            joiningDate: '2020-03-15',
            bloodGroup: 'O+',
            address: '123, MG Road, Bangalore',
            project: 'Project Phoenix',
            reportingManager: 'Amit Sharma',
            status: 'Active',
            progress: 92,
            attendance: 98,
            tasksCompleted: 145,
            tasksPending: 5,
            performance: 4.8,
            workHours: 8.5,
            checkIn: '09:00 AM',
            checkOut: '06:30 PM',
            image: null
        },
        {
            id: 'EMP002',
            name: 'Priya Sharma',
            email: 'priya.sharma@company.com',
            password: 'emp@002',
            phone: '+91 9876543211',
            department: 'Web Development',
            designation: 'Full Stack Developer',
            joiningDate: '2021-06-01',
            bloodGroup: 'A+',
            address: '456, Brigade Road, Bangalore',
            project: 'Project Atlas',
            reportingManager: 'Sneha Patel',
            status: 'Active',
            progress: 85,
            attendance: 95,
            tasksCompleted: 98,
            tasksPending: 8,
            performance: 4.5,
            workHours: 8.0,
            checkIn: '09:15 AM',
            checkOut: '06:00 PM',
            image: null
        },
        {
            id: 'EMP003',
            name: 'Amit Patel',
            email: 'amit.patel@company.com',
            password: 'emp@003',
            phone: '+91 9876543212',
            department: 'UI/UX Design',
            designation: 'UI/UX Designer',
            joiningDate: '2022-01-10',
            bloodGroup: 'B+',
            address: '789, Indiranagar, Bangalore',
            project: 'Project Zenith',
            reportingManager: 'Neha Gupta',
            status: 'Active',
            progress: 78,
            attendance: 92,
            tasksCompleted: 67,
            tasksPending: 12,
            performance: 4.2,
            workHours: 7.5,
            checkIn: '09:30 AM',
            checkOut: '05:45 PM',
            image: null
        },
        {
            id: 'EMP004',
            name: 'Sneha Reddy',
            email: 'sneha.reddy@company.com',
            password: 'emp@004',
            phone: '+91 9876543213',
            department: 'Data Analytics',
            designation: 'Data Analyst',
            joiningDate: '2021-11-20',
            bloodGroup: 'AB+',
            address: '321, Koramangala, Bangalore',
            project: 'Project DataStream',
            reportingManager: 'Vikram Singh',
            status: 'Active',
            progress: 70,
            attendance: 88,
            tasksCompleted: 55,
            tasksPending: 15,
            performance: 3.8,
            workHours: 8.0,
            checkIn: '09:00 AM',
            checkOut: '06:00 PM',
            image: null
        },
        {
            id: 'EMP005',
            name: 'Vikram Singh',
            email: 'vikram.singh@company.com',
            password: 'emp@005',
            phone: '+91 9876543214',
            department: 'Artificial Intelligence',
            designation: 'AI Engineer',
            joiningDate: '2020-08-05',
            bloodGroup: 'O-',
            address: '567, Whitefield, Bangalore',
            project: 'Project NeuralNet',
            reportingManager: 'Rajesh Kumar',
            status: 'Active',
            progress: 95,
            attendance: 99,
            tasksCompleted: 120,
            tasksPending: 3,
            performance: 4.9,
            workHours: 9.0,
            checkIn: '08:45 AM',
            checkOut: '07:00 PM',
            image: null
        },
        {
            id: 'EMP006',
            name: 'Neha Gupta',
            email: 'neha.gupta@company.com',
            password: 'emp@006',
            phone: '+91 9876543215',
            department: 'Human Resources',
            designation: 'HR Manager',
            joiningDate: '2019-04-01',
            bloodGroup: 'A-',
            address: '890, JP Nagar, Bangalore',
            project: 'Project TalentHub',
            reportingManager: 'Amit Sharma',
            status: 'Active',
            progress: 88,
            attendance: 96,
            tasksCompleted: 82,
            tasksPending: 6,
            performance: 4.6,
            workHours: 8.0,
            checkIn: '09:00 AM',
            checkOut: '06:00 PM',
            image: null
        },
        {
            id: 'EMP007',
            name: 'Arjun Nair',
            email: 'arjun.nair@company.com',
            password: 'emp@007',
            phone: '+91 9876543216',
            department: 'Marketing',
            designation: 'Marketing Lead',
            joiningDate: '2021-02-15',
            bloodGroup: 'B-',
            address: '234, Electronic City, Bangalore',
            project: 'Project BrandBoost',
            reportingManager: 'Priya Sharma',
            status: 'Active',
            progress: 75,
            attendance: 90,
            tasksCompleted: 45,
            tasksPending: 10,
            performance: 4.0,
            workHours: 7.5,
            checkIn: '09:30 AM',
            checkOut: '05:30 PM',
            image: null
        },
        {
            id: 'EMP008',
            name: 'Divya Menon',
            email: 'divya.menon@company.com',
            password: 'emp@008',
            phone: '+91 9876543217',
            department: 'Finance',
            designation: 'Finance Analyst',
            joiningDate: '2022-06-01',
            bloodGroup: 'AB-',
            address: '678, Jayanagar, Bangalore',
            project: 'Project FinTrack',
            reportingManager: 'Neha Gupta',
            status: 'Active',
            progress: 65,
            attendance: 85,
            tasksCompleted: 35,
            tasksPending: 18,
            performance: 3.5,
            workHours: 7.0,
            checkIn: '09:45 AM',
            checkOut: '05:15 PM',
            image: null
        },
        {
            id: 'EMP009',
            name: 'Rohan Desai',
            email: 'rohan.desai@company.com',
            password: 'emp@009',
            phone: '+91 9876543218',
            department: 'Quality Assurance',
            designation: 'QA Lead',
            joiningDate: '2020-09-12',
            bloodGroup: 'O+',
            address: '432, BTM Layout, Bangalore',
            project: 'Project QualityFirst',
            reportingManager: 'Vikram Singh',
            status: 'Active',
            progress: 82,
            attendance: 93,
            tasksCompleted: 110,
            tasksPending: 7,
            performance: 4.3,
            workHours: 8.0,
            checkIn: '09:00 AM',
            checkOut: '06:00 PM',
            image: null
        },
        {
            id: 'EMP010',
            name: 'Kavita Joshi',
            email: 'kavita.joshi@company.com',
            password: 'emp@010',
            phone: '+91 9876543219',
            department: 'Administration',
            designation: 'Admin Officer',
            joiningDate: '2018-07-01',
            bloodGroup: 'A+',
            address: '901, Malleshwaram, Bangalore',
            project: 'Project OfficeOps',
            reportingManager: 'Rajesh Kumar',
            status: 'Active',
            progress: 90,
            attendance: 97,
            tasksCompleted: 95,
            tasksPending: 4,
            performance: 4.7,
            workHours: 8.5,
            checkIn: '08:30 AM',
            checkOut: '06:30 PM',
            image: null
        },
        {
            id: 'EMP011',
            name: 'Suresh Iyer',
            email: 'suresh.iyer@company.com',
            password: 'emp@011',
            phone: '+91 9876543220',
            department: 'Software Development',
            designation: 'Junior Developer',
            joiningDate: '2023-01-10',
            bloodGroup: 'B+',
            address: '543, HSR Layout, Bangalore',
            project: 'Project Phoenix',
            reportingManager: 'Rajesh Kumar',
            status: 'Active',
            progress: 45,
            attendance: 82,
            tasksCompleted: 22,
            tasksPending: 20,
            performance: 3.2,
            workHours: 7.0,
            checkIn: '09:30 AM',
            checkOut: '05:30 PM',
            image: null
        },
        {
            id: 'EMP012',
            name: 'Ananya Verma',
            email: 'ananya.verma@company.com',
            password: 'emp@012',
            phone: '+91 9876543221',
            department: 'Web Development',
            designation: 'Frontend Developer',
            joiningDate: '2022-09-15',
            bloodGroup: 'O+',
            address: '765, Marathahalli, Bangalore',
            project: 'Project Atlas',
            reportingManager: 'Sneha Patel',
            status: 'Active',
            progress: 55,
            attendance: 87,
            tasksCompleted: 38,
            tasksPending: 16,
            performance: 3.6,
            workHours: 7.5,
            checkIn: '09:15 AM',
            checkOut: '05:45 PM',
            image: null
        },
        {
            id: 'EMP013',
            name: 'Manish Tiwari',
            email: 'manish.tiwari@company.com',
            password: 'emp@013',
            phone: '+91 9876543222',
            department: 'Data Analytics',
            designation: 'Data Engineer',
            joiningDate: '2021-12-01',
            bloodGroup: 'AB+',
            address: '210, Yelahanka, Bangalore',
            project: 'Project DataStream',
            reportingManager: 'Sneha Reddy',
            status: 'On Leave',
            progress: 60,
            attendance: 78,
            tasksCompleted: 42,
            tasksPending: 14,
            performance: 3.7,
            workHours: 7.0,
            checkIn: '09:00 AM',
            checkOut: '05:00 PM',
            image: null
        },
        {
            id: 'EMP014',
            name: 'Pooja Mehta',
            email: 'pooja.mehta@company.com',
            password: 'emp@014',
            phone: '+91 9876543223',
            department: 'Artificial Intelligence',
            designation: 'ML Engineer',
            joiningDate: '2022-03-20',
            bloodGroup: 'A-',
            address: '876, Hebbal, Bangalore',
            project: 'Project NeuralNet',
            reportingManager: 'Vikram Singh',
            status: 'Active',
            progress: 72,
            attendance: 91,
            tasksCompleted: 58,
            tasksPending: 11,
            performance: 4.1,
            workHours: 8.0,
            checkIn: '09:00 AM',
            checkOut: '06:00 PM',
            image: null
        }
    ],
    projects: [
        {
            id: 'PRJ001',
            name: 'Project Phoenix',
            manager: 'Rajesh Kumar',
            team: ['EMP001', 'EMP011'],
            startDate: '2024-01-15',
            deadline: '2024-12-31',
            status: 'In Progress',
            priority: 'High',
            completion: 72
        },
        {
            id: 'PRJ002',
            name: 'Project Atlas',
            manager: 'Sneha Patel',
            team: ['EMP002', 'EMP012'],
            startDate: '2024-02-01',
            deadline: '2024-10-30',
            status: 'In Progress',
            priority: 'High',
            completion: 58
        },
        {
            id: 'PRJ003',
            name: 'Project Zenith',
            manager: 'Neha Gupta',
            team: ['EMP003'],
            startDate: '2024-03-01',
            deadline: '2024-09-15',
            status: 'In Progress',
            priority: 'Medium',
            completion: 45
        },
        {
            id: 'PRJ004',
            name: 'Project DataStream',
            manager: 'Sneha Reddy',
            team: ['EMP004', 'EMP013'],
            startDate: '2024-04-01',
            deadline: '2024-11-30',
            status: 'In Progress',
            priority: 'Medium',
            completion: 35
        },
        {
            id: 'PRJ005',
            name: 'Project NeuralNet',
            manager: 'Vikram Singh',
            team: ['EMP005', 'EMP014'],
            startDate: '2024-01-01',
            deadline: '2024-08-31',
            status: 'In Progress',
            priority: 'High',
            completion: 88
        },
        {
            id: 'PRJ006',
            name: 'Project TalentHub',
            manager: 'Amit Sharma',
            team: ['EMP006'],
            startDate: '2024-02-15',
            deadline: '2024-07-31',
            status: 'Completed',
            priority: 'Low',
            completion: 100
        },
        {
            id: 'PRJ007',
            name: 'Project BrandBoost',
            manager: 'Priya Sharma',
            team: ['EMP007'],
            startDate: '2024-05-01',
            deadline: '2024-12-31',
            status: 'On Hold',
            priority: 'Medium',
            completion: 20
        },
        {
            id: 'PRJ008',
            name: 'Project FinTrack',
            manager: 'Neha Gupta',
            team: ['EMP008'],
            startDate: '2024-06-01',
            deadline: '2025-03-31',
            status: 'Not Started',
            priority: 'Low',
            completion: 0
        },
        {
            id: 'PRJ009',
            name: 'Project QualityFirst',
            manager: 'Rohan Desai',
            team: ['EMP009'],
            startDate: '2024-03-15',
            deadline: '2024-09-30',
            status: 'Completed',
            priority: 'Medium',
            completion: 100
        },
        {
            id: 'PRJ010',
            name: 'Project OfficeOps',
            manager: 'Kavita Joshi',
            team: ['EMP010'],
            startDate: '2024-01-01',
            deadline: '2024-06-30',
            status: 'Completed',
            priority: 'Low',
            completion: 100
        }
    ],
    reports: [
        {
            id: 'RPT001',
            employeeId: 'EMP001',
            employeeName: 'Rajesh Kumar',
            project: 'Project Phoenix',
            date: '2024-06-21',
            tasksCompleted: 5,
            tasksPending: 1,
            workingHours: 8.5,
            progress: 92,
            managerComments: 'Excellent work this week. Keep it up!',
            status: 'Approved'
        },
        {
            id: 'RPT002',
            employeeId: 'EMP002',
            employeeName: 'Priya Sharma',
            project: 'Project Atlas',
            date: '2024-06-21',
            tasksCompleted: 4,
            tasksPending: 2,
            workingHours: 8.0,
            progress: 85,
            managerComments: 'Good progress, need to focus on pending tasks.',
            status: 'Approved'
        },
        {
            id: 'RPT003',
            employeeId: 'EMP003',
            employeeName: 'Amit Patel',
            project: 'Project Zenith',
            date: '2024-06-21',
            tasksCompleted: 3,
            tasksPending: 2,
            workingHours: 7.5,
            progress: 78,
            managerComments: 'Design quality is good, please improve speed.',
            status: 'Pending'
        },
        {
            id: 'RPT004',
            employeeId: 'EMP004',
            employeeName: 'Sneha Reddy',
            project: 'Project DataStream',
            date: '2024-06-21',
            tasksCompleted: 2,
            tasksPending: 3,
            workingHours: 8.0,
            progress: 70,
            managerComments: '',
            status: 'Submitted'
        },
        {
            id: 'RPT005',
            employeeId: 'EMP005',
            employeeName: 'Vikram Singh',
            project: 'Project NeuralNet',
            date: '2024-06-21',
            tasksCompleted: 6,
            tasksPending: 0,
            workingHours: 9.0,
            progress: 95,
            managerComments: 'Outstanding performance!',
            status: 'Approved'
        },
        {
            id: 'RPT006',
            employeeId: 'EMP006',
            employeeName: 'Neha Gupta',
            project: 'Project TalentHub',
            date: '2024-06-20',
            tasksCompleted: 4,
            tasksPending: 1,
            workingHours: 8.0,
            progress: 88,
            managerComments: 'HR initiatives are on track.',
            status: 'Approved'
        },
        {
            id: 'RPT007',
            employeeId: 'EMP007',
            employeeName: 'Arjun Nair',
            project: 'Project BrandBoost',
            date: '2024-06-20',
            tasksCompleted: 2,
            tasksPending: 4,
            workingHours: 7.5,
            progress: 75,
            managerComments: '',
            status: 'Pending'
        },
        {
            id: 'RPT008',
            employeeId: 'EMP008',
            employeeName: 'Divya Menon',
            project: 'Project FinTrack',
            date: '2024-06-20',
            tasksCompleted: 1,
            tasksPending: 5,
            workingHours: 7.0,
            progress: 65,
            managerComments: 'Need improvement in financial reporting.',
            status: 'Rejected'
        },
        {
            id: 'RPT009',
            employeeId: 'EMP009',
            employeeName: 'Rohan Desai',
            project: 'Project QualityFirst',
            date: '2024-06-19',
            tasksCompleted: 5,
            tasksPending: 1,
            workingHours: 8.0,
            progress: 82,
            managerComments: 'QA processes are well maintained.',
            status: 'Approved'
        },
        {
            id: 'RPT010',
            employeeId: 'EMP010',
            employeeName: 'Kavita Joshi',
            project: 'Project OfficeOps',
            date: '2024-06-19',
            tasksCompleted: 4,
            tasksPending: 2,
            workingHours: 8.5,
            progress: 90,
            managerComments: 'Administration running smoothly.',
            status: 'Approved'
        },
        {
            id: 'RPT011',
            employeeId: 'EMP011',
            employeeName: 'Suresh Iyer',
            project: 'Project Phoenix',
            date: '2024-06-18',
            tasksCompleted: 2,
            tasksPending: 4,
            workingHours: 7.0,
            progress: 45,
            managerComments: 'Needs more focus and training.',
            status: 'Pending'
        },
        {
            id: 'RPT012',
            employeeId: 'EMP012',
            employeeName: 'Ananya Verma',
            project: 'Project Atlas',
            date: '2024-06-18',
            tasksCompleted: 3,
            tasksPending: 3,
            workingHours: 7.5,
            progress: 55,
            managerComments: '',
            status: 'Submitted'
        }
    ],
    attendance: [
        { employeeId: 'EMP001', date: '2024-06-21', checkIn: '09:00 AM', checkOut: '06:30 PM', hours: 8.5, status: 'Present' },
        { employeeId: 'EMP002', date: '2024-06-21', checkIn: '09:15 AM', checkOut: '06:00 PM', hours: 8.0, status: 'Present' },
        { employeeId: 'EMP003', date: '2024-06-21', checkIn: '09:30 AM', checkOut: '05:45 PM', hours: 7.5, status: 'Present' },
        { employeeId: 'EMP004', date: '2024-06-21', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: 8.0, status: 'Present' },
        { employeeId: 'EMP005', date: '2024-06-21', checkIn: '08:45 AM', checkOut: '07:00 PM', hours: 9.0, status: 'Present' },
        { employeeId: 'EMP006', date: '2024-06-21', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: 8.0, status: 'Present' },
        { employeeId: 'EMP007', date: '2024-06-21', checkIn: '09:30 AM', checkOut: '05:30 PM', hours: 7.5, status: 'Late' },
        { employeeId: 'EMP008', date: '2024-06-21', checkIn: '09:45 AM', checkOut: '05:15 PM', hours: 7.0, status: 'Late' },
        { employeeId: 'EMP009', date: '2024-06-21', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: 8.0, status: 'Present' },
        { employeeId: 'EMP010', date: '2024-06-21', checkIn: '08:30 AM', checkOut: '06:30 PM', hours: 8.5, status: 'Present' },
        { employeeId: 'EMP011', date: '2024-06-21', checkIn: '09:30 AM', checkOut: '05:30 PM', hours: 7.0, status: 'Present' },
        { employeeId: 'EMP012', date: '2024-06-21', checkIn: '09:15 AM', checkOut: '05:45 PM', hours: 7.5, status: 'Present' },
        { employeeId: 'EMP013', date: '2024-06-21', checkIn: '-', checkOut: '-', hours: 0, status: 'On Leave' },
        { employeeId: 'EMP014', date: '2024-06-21', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: 8.0, status: 'Present' }
    ]
};

const dashboardStats = {
    totalEmployees: CompanyData.employees.length,
    activeEmployees: CompanyData.employees.filter(e => e.status === 'Active').length,
    onLeave: CompanyData.employees.filter(e => e.status === 'On Leave').length,
    totalDepartments: CompanyData.departments.length,
    ongoingProjects: CompanyData.projects.filter(p => p.status === 'In Progress').length,
    completedProjects: CompanyData.projects.filter(p => p.status === 'Completed').length,
    pendingReports: CompanyData.reports.filter(r => r.status === 'Pending' || r.status === 'Submitted').length,
    averageProgress: Math.round(CompanyData.employees.reduce((sum, e) => sum + e.progress, 0) / CompanyData.employees.length)
};

function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

function getProgressLevel(progress) {
    if (progress <= 30) return { text: 'Needs Improvement', class: 'red' };
    if (progress <= 60) return { text: 'Average', class: 'orange' };
    if (progress <= 80) return { text: 'Good', class: 'blue' };
    return { text: 'Excellent', class: 'green' };
}

function getEmployeeById(id) {
    return CompanyData.employees.find(e => e.id === id);
}

function getEmployeesByDepartment(dept) {
    return CompanyData.employees.filter(e => e.department === dept);
}

function getProjectById(id) {
    return CompanyData.projects.find(p => p.id === id);
}

function getEmployeeProject(employeeId) {
    return CompanyData.projects.find(p => p.team.includes(employeeId));
}

function getReportsByEmployee(employeeId) {
    return CompanyData.reports.filter(r => r.employeeId === employeeId);
}

function getAttendanceByEmployee(employeeId) {
    return CompanyData.attendance.filter(a => a.employeeId === employeeId);
}

function formatDate(dateStr) {
    const d = new Date(dateStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return d.getDate() + ' ' + months[d.getMonth()] + ', ' + d.getFullYear();
}

function getDaysRemaining(dateStr) {
    const now = new Date();
    const deadline = new Date(dateStr);
    const diff = deadline - now;
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function getPriorityColor(priority) {
    switch (priority) {
        case 'High': return '#dc3545';
        case 'Medium': return '#ffc107';
        case 'Low': return '#28a745';
        default: return '#6c757d';
    }
}

function getStatusColor(status) {
    switch (status) {
        case 'Active': case 'Present': case 'Approved': case 'Completed': return '#28a745';
        case 'In Progress': case 'Submitted': return '#007bff';
        case 'Pending': case 'On Hold': return '#ffc107';
        case 'Late': return '#ff9800';
        case 'Rejected': case 'On Leave': case 'Not Started': return '#dc3545';
        default: return '#6c757d';
    }
}

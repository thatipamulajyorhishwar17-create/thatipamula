let currentPage = 1;
const rowsPerPage = 8;

document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    initSidebar();
    initDarkMode();
    initNotifications();
    initHeaderSearch();
    initPageSpecific();
    loadSavedData();
});

function checkAuth() {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    const user = localStorage.getItem('loggedInUser');
    if (page !== 'login.html' && page !== 'index.html' && !user) {
        window.location.href = 'login.html';
    }
    if ((page === 'login.html' || page === 'index.html') && user) {
        window.location.href = 'dashboard.html';
    }
}

function loadSavedData() {
    const saved = localStorage.getItem('companyPortalEmployees');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
                CompanyData.employees = parsed;
                dashboardStats.totalEmployees = parsed.length;
                dashboardStats.activeEmployees = parsed.filter(e => e.status === 'Active').length;
                dashboardStats.onLeave = parsed.filter(e => e.status === 'On Leave').length;
                dashboardStats.averageProgress = Math.round(parsed.reduce((sum, e) => sum + e.progress, 0) / parsed.length);
            }
        } catch(e) {}
    }
    loadSavedReports();
}

function loadSavedReports() {
    const saved = localStorage.getItem('companyPortalReports');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
                CompanyData.reports = parsed;
                dashboardStats.pendingReports = parsed.filter(r => r.status === 'Pending' || r.status === 'Submitted').length;
            }
        } catch(e) {}
    }
}

function saveEmployees() {
    localStorage.setItem('companyPortalEmployees', JSON.stringify(CompanyData.employees));
}

function initSidebar() {
    const toggleBtn = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');

    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', function() {
            sidebar.classList.toggle('open');
            if (overlay) overlay.classList.toggle('active');
        });
    }

    if (overlay) {
        overlay.addEventListener('click', function() {
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
        });
    }

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        }
    });

    const userData = localStorage.getItem('loggedInUser');
    if (userData) {
        try {
            const user = JSON.parse(userData);
            const avatar = document.querySelector('.user-profile .avatar');
            const nameEl = document.querySelector('.user-profile .user-info .name');
            const roleEl = document.querySelector('.user-profile .user-info .role');
            if (avatar && user.name) {
                avatar.textContent = user.name.charAt(0).toUpperCase();
            }
            if (nameEl && user.name) {
                nameEl.textContent = user.name;
            }
            if (roleEl) {
                roleEl.textContent = user.role === 'admin' ? 'Administrator' : (user.department || 'Employee');
            }

            if (user.role === 'employee') {
                document.querySelectorAll('.sidebar-nav a').forEach(link => {
                    const href = link.getAttribute('href');
                    if (href === 'employees.html' || href === 'reports.html' || href === 'analysis.html') {
                        link.style.display = 'none';
                    }
                });
                const labels = document.querySelectorAll('.sidebar-nav .nav-label');
                if (labels.length > 0) {
                    labels[0].style.display = 'none';
                }
            }
        } catch(e) {}
    }
}

function initDarkMode() {
    const toggle = document.getElementById('darkModeToggle');
    if (toggle) {
        const isDark = localStorage.getItem('darkMode') === 'true';
        if (isDark) {
            document.body.classList.add('dark-mode');
        }
        toggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
        });
    }
}

function initNotifications() {
    const notifBtn = document.getElementById('notifBtn');
    if (notifBtn) {
        notifBtn.addEventListener('click', function() {
            showNotification('You have 3 new notifications', 'info');
        });
    }
    const msgBtn = document.getElementById('msgBtn');
    if (msgBtn) {
        msgBtn.addEventListener('click', function() {
            showNotification('You have 2 unread messages', 'info');
        });
    }
}

function initHeaderSearch() {
    const searchInput = document.getElementById('headerSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const val = e.target.value.trim().toLowerCase();
            const employeeRows = document.querySelectorAll('.employee-row');
            if (employeeRows.length > 0) {
                employeeRows.forEach(row => {
                    const name = row.querySelector('.user-name')?.textContent?.toLowerCase() || '';
                    const id = row.querySelector('.emp-id')?.textContent?.toLowerCase() || '';
                    row.style.display = (name.includes(val) || id.includes(val)) ? '' : 'none';
                });
            }
        });
    }
}

function initPageSpecific() {
    const page = window.location.pathname.split('/').pop();

    if (page === 'login.html' || page === '') {
        initLogin();
    }
    if (page === 'dashboard.html') {
        initDashboard();
    }
    if (page === 'employees.html') {
        initEmployees();
    }
    if (page === 'employee-details.html') {
        initEmployeeDetails();
    }
    if (page === 'reports.html') {
        initReports();
    }
    if (page === 'projects.html') {
        initProjects();
    }
    if (page === 'attendance.html') {
        initAttendance();
    }
    if (page === 'analysis.html') {
        initAnalysis();
    }
}

function initLogin() {
    const form = document.getElementById('loginForm');
    const demoMsg = document.getElementById('demoMsg');
    if (demoMsg) {
        demoMsg.textContent = 'Demo: Admin (ID: admin, Password: admin123) | Employee (use any EMP ID, Password: emp@XXX)';
    }
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const empId = document.getElementById('empId').value.trim();
            const password = document.getElementById('password').value.trim();
            const role = document.getElementById('role').value;

            if (!empId) {
                showNotification('Please enter Employee ID or Email', 'error');
                return;
            }
            if (!password) {
                showNotification('Please enter password', 'error');
                return;
            }

            const employee = CompanyData.employees.find(e => e.id === empId || e.email === empId);

            if (role === 'admin') {
                if ((empId === 'admin' || empId === 'admin@company.com') && password === 'admin123') {
                    showNotification('Login successful! Welcome Admin', 'success');
                    localStorage.setItem('loggedInUser', JSON.stringify({ id: 'admin', name: 'Admin', role: 'admin' }));
                    setTimeout(() => { window.location.href = 'dashboard.html'; }, 800);
                } else {
                    showNotification('Invalid admin credentials!', 'error');
                }
            } else {
                if (!employee) {
                    showNotification('Employee not found! Please check your ID or email', 'error');
                    return;
                }
                if (password === employee.password) {
                    showNotification('Login successful! Welcome ' + employee.name, 'success');
                    localStorage.setItem('loggedInUser', JSON.stringify({ id: employee.id, name: employee.name, role: 'employee', department: employee.department }));
                    setTimeout(() => { window.location.href = 'dashboard.html'; }, 800);
                } else {
                    showNotification('Invalid password for ' + employee.id + '. Use your employee password', 'error');
                }
            }
        });
    }
}

function initDashboard() {
    const userData = localStorage.getItem('loggedInUser');
    if (userData) {
        try {
            const user = JSON.parse(userData);
            if (user.role === 'employee') {
                const emp = getEmployeeById(user.id);
                if (emp) {
                    document.getElementById('totalEmployees') && (document.getElementById('totalEmployees').textContent = emp.name);
                    document.getElementById('activeEmployees') && (document.getElementById('activeEmployees').textContent = emp.department);
                    document.getElementById('onLeave') && (document.getElementById('onLeave').textContent = emp.designation);
                    document.getElementById('totalDepartments') && (document.getElementById('totalDepartments').textContent = emp.attendance + '%');
                    document.getElementById('ongoingProjects') && (document.getElementById('ongoingProjects').textContent = emp.project || 'N/A');
                    document.getElementById('completedProjects') && (document.getElementById('completedProjects').textContent = emp.progress + '%');
                    document.getElementById('pendingReports') && (document.getElementById('pendingReports').textContent = emp.performance + '/5');
                    document.getElementById('averageProgress') && (document.getElementById('averageProgress').textContent = emp.workHours + 'h');
                    document.querySelectorAll('.card-label').forEach((el, i) => {
                        const labels = ['Name', 'Department', 'Designation', 'Attendance', 'Project', 'Progress', 'Performance', 'Work Hours'];
                        if (i < labels.length) el.textContent = labels[i];
                    });
                    document.querySelector('.page-header h2').textContent = 'My Dashboard';
                    document.querySelector('.breadcrumb').textContent = 'Home / My Dashboard';
                    return;
                }
            }
        } catch(e) {}
    }
    setTimeout(() => {
        animateCounter('totalEmployees', dashboardStats.totalEmployees);
        animateCounter('activeEmployees', dashboardStats.activeEmployees);
        animateCounter('onLeave', dashboardStats.onLeave);
        animateCounter('totalDepartments', dashboardStats.totalDepartments);
        animateCounter('ongoingProjects', dashboardStats.ongoingProjects);
        animateCounter('completedProjects', dashboardStats.completedProjects);
        animateCounter('pendingReports', dashboardStats.pendingReports);
        animateCounter('averageProgress', dashboardStats.averageProgress);
    }, 200);

    initDashboardCharts();
}

function animateCounter(elementId, target) {
    const el = document.getElementById(elementId);
    if (!el) return;
    const duration = 1200;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    const stepTime = duration / steps;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            el.textContent = target;
            clearInterval(timer);
        } else {
            el.textContent = Math.round(current);
        }
    }, stepTime);
}

function initDashboardCharts() {
    if (typeof Chart === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        script.onload = function() {
            createCharts();
        };
        document.head.appendChild(script);
    } else {
        createCharts();
    }
}

function createCharts() {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const monthlyCtx = document.getElementById('monthlyProgressChart');
    if (monthlyCtx) {
        new Chart(monthlyCtx, {
            type: 'line',
            data: {
                labels: monthNames,
                datasets: [{
                    label: 'Monthly Progress',
                    data: [45, 52, 58, 63, 70, 76, 80, 82, 85, 88, 90, 92],
                    borderColor: '#1976d2',
                    backgroundColor: 'rgba(25,118,210,0.1)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#1976d2'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, max: 100, grid: { color: 'rgba(0,0,0,0.05)' } }, x: { grid: { display: false } } }
            }
        });
    }

    const deptCtx = document.getElementById('departmentChart');
    if (deptCtx) {
        const deptProgress = CompanyData.departments.map(d => {
            const emps = CompanyData.employees.filter(e => e.department === d);
            return emps.length ? Math.round(emps.reduce((s, e) => s + e.progress, 0) / emps.length) : 0;
        });
        new Chart(deptCtx, {
            type: 'bar',
            data: {
                labels: CompanyData.departments,
                datasets: [{
                    label: 'Progress %',
                    data: deptProgress,
                    backgroundColor: [
                        '#1976d2', '#28a745', '#ff9800', '#dc3545',
                        '#7b1fa2', '#00796b', '#e91e63', '#ffc107',
                        '#00acc1', '#6c757d'
                    ],
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, max: 100, grid: { color: 'rgba(0,0,0,0.05)' } }, x: { grid: { display: false } } }
            }
        });
    }

    const projectCtx = document.getElementById('projectChart');
    if (projectCtx) {
        new Chart(projectCtx, {
            type: 'doughnut',
            data: {
                labels: ['In Progress', 'Completed', 'On Hold', 'Not Started'],
                datasets: [{
                    data: [
                        CompanyData.projects.filter(p => p.status === 'In Progress').length,
                        CompanyData.projects.filter(p => p.status === 'Completed').length,
                        CompanyData.projects.filter(p => p.status === 'On Hold').length,
                        CompanyData.projects.filter(p => p.status === 'Not Started').length
                    ],
                    backgroundColor: ['#1976d2', '#28a745', '#ffc107', '#6c757d'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom', labels: { padding: 16, usePointStyle: true } } },
                cutout: '65%'
            }
        });
    }

    const attendanceCtx = document.getElementById('attendanceChart');
    if (attendanceCtx) {
        const present = CompanyData.attendance.filter(a => a.status === 'Present').length;
        const absent = CompanyData.attendance.filter(a => a.status === 'Absent').length;
        const late = CompanyData.attendance.filter(a => a.status === 'Late').length;
        const leave = CompanyData.attendance.filter(a => a.status === 'On Leave').length;
        new Chart(attendanceCtx, {
            type: 'pie',
            data: {
                labels: ['Present', 'Absent', 'Late', 'On Leave'],
                datasets: [{
                    data: [present, absent, late, leave],
                    backgroundColor: ['#28a745', '#dc3545', '#ff9800', '#ffc107'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom', labels: { padding: 16, usePointStyle: true } } }
            }
        });
    }
}

function initEmployees() {
    loadEmployeeTable();
    setupEmployeeFilters();
    setupEmployeeModals();
    setupAddEmployee();
}

function loadEmployeeTable() {
    const tbody = document.getElementById('employeeTableBody');
    if (!tbody) return;

    const deptFilter = document.getElementById('deptFilter')?.value || 'all';
    const statusFilter = document.getElementById('statusFilter')?.value || 'all';
    const searchVal = document.getElementById('empSearch')?.value?.toLowerCase() || '';

    let filtered = [...CompanyData.employees];

    if (deptFilter !== 'all') {
        filtered = filtered.filter(e => e.department === deptFilter);
    }
    if (statusFilter !== 'all') {
        filtered = filtered.filter(e => e.status === statusFilter);
    }
    if (searchVal) {
        filtered = filtered.filter(e =>
            e.name.toLowerCase().includes(searchVal) ||
            e.id.toLowerCase().includes(searchVal) ||
            e.email.toLowerCase().includes(searchVal)
        );
    }

    const totalPages = Math.ceil(filtered.length / rowsPerPage);
    if (currentPage > totalPages) currentPage = 1;
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const pageData = filtered.slice(start, end);

    if (pageData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="12" style="text-align:center;padding:40px;color:var(--grey-500);">No employees found</td></tr>`;
        document.getElementById('pagination') && (document.getElementById('pagination').innerHTML = '');
        return;
    }

    tbody.innerHTML = pageData.map(emp => {
        const initials = getInitials(emp.name);
        const progressLevel = getProgressLevel(emp.progress);
        return `<tr class="employee-row">
            <td>
                <div class="user-cell">
                    ${getEmployeeAvatar(emp)}
                    <div class="user-details">
                        <div class="user-name">${emp.name}</div>
                        <div class="user-sub emp-id">${emp.id}</div>
                    </div>
                </div>
            </td>
            <td>${emp.email}</td>
            <td>${emp.phone}</td>
            <td>${emp.department}</td>
            <td>${emp.designation}</td>
            <td>${formatDate(emp.joiningDate)}</td>
            <td>${emp.project || 'Not assigned'}</td>
            <td><span class="badge ${getStatusColor(emp.status) === '#28a745' ? 'badge-success' : getStatusColor(emp.status) === '#ffc107' ? 'badge-warning' : 'badge-danger'}">${emp.status}</span></td>
            <td>
                <div class="progress-bar">
                    <div class="progress-fill ${progressLevel.class}" style="width:${emp.progress}%"></div>
                </div>
                <div class="progress-text">
                    <span>${emp.progress}%</span>
                    <span>${progressLevel.text}</span>
                </div>
            </td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="viewEmployee('${emp.id}')">View</button>
                <button class="btn btn-outline btn-sm" onclick="editEmployee('${emp.id}')" style="margin-top:4px;">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteEmployee('${emp.id}')" style="margin-top:4px;">Delete</button>
            </td>
        </tr>`;
    }).join('');

    renderPagination(totalPages);
}

function renderPagination(totalPages) {
    const container = document.getElementById('pagination');
    if (!container) return;

    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }

    let html = `<button onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>&laquo;</button>`;
    for (let i = 1; i <= totalPages; i++) {
        html += `<button onclick="changePage(${i})" class="${i === currentPage ? 'active' : ''}">${i}</button>`;
    }
    html += `<button onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>&raquo;</button>`;
    container.innerHTML = html;
}

function changePage(page) {
    currentPage = page;
    loadEmployeeTable();
}

function setupEmployeeFilters() {
    const deptFilter = document.getElementById('deptFilter');
    const statusFilter = document.getElementById('statusFilter');
    const empSearch = document.getElementById('empSearch');

    if (deptFilter) {
        deptFilter.innerHTML = '<option value="all">All Departments</option>' +
            CompanyData.departments.map(d => `<option value="${d}">${d}</option>`).join('');
        deptFilter.addEventListener('change', function() { currentPage = 1; loadEmployeeTable(); });
    }
    if (statusFilter) {
        statusFilter.addEventListener('change', function() { currentPage = 1; loadEmployeeTable(); });
    }
    if (empSearch) {
        empSearch.addEventListener('input', function() { currentPage = 1; loadEmployeeTable(); });
    }
}

function setupEmployeeModals() {
    const modals = document.querySelectorAll('.modal-overlay');
    modals.forEach(modal => {
        const closeBtn = modal.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                modal.classList.remove('active');
            });
        }
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
}

function setupAddEmployee() {
    const addBtn = document.getElementById('addEmployeeBtn');
    if (addBtn) {
        addBtn.addEventListener('click', function() {
            openAddEmployeeModal();
        });
    }
}

function previewEmployeePhoto(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const label = document.getElementById('photoName');
    if (label) label.textContent = file.name;
    const reader = new FileReader();
    reader.onload = function(e) {
        const preview = document.getElementById('photoPreview');
        const img = document.getElementById('previewImg');
        if (preview && img) {
            img.src = e.target.result;
            preview.style.display = 'block';
            preview.setAttribute('data-photo', e.target.result);
        }
    };
    reader.readAsDataURL(file);
}

function clearPhotoPreview() {
    const preview = document.getElementById('photoPreview');
    const img = document.getElementById('previewImg');
    const label = document.getElementById('photoName');
    const input = document.getElementById('photoInput');
    if (preview) { preview.style.display = 'none'; preview.removeAttribute('data-photo'); }
    if (img) img.src = '';
    if (label) label.textContent = 'No file chosen';
    if (input) input.value = '';
}

function getEmployeeAvatar(emp) {
    if (emp && emp.image) {
        return '<img src="' + emp.image + '" alt="' + emp.name + '" style="width:36px;height:36px;border-radius:50%;object-fit:cover;">';
    }
    const initials = emp ? getInitials(emp.name) : '?';
    return '<div class="user-avatar">' + initials + '</div>';
}

function getEmployeeAvatarSmall(emp) {
    if (emp && emp.image) {
        return '<img src="' + emp.image + '" alt="' + emp.name + '" style="width:32px;height:32px;border-radius:50%;object-fit:cover;">';
    }
    const initials = emp ? getInitials(emp.name) : '?';
    return '<div class="user-avatar" style="width:32px;height:32px;font-size:11px;">' + initials + '</div>';
}

function openAddEmployeeModal() {
    const modal = document.getElementById('addEmployeeModal');
    const form = document.getElementById('addEmployeeForm');
    if (!modal) return;

    clearPhotoPreview();

    modal.classList.add('active');

    if (form) {
        form.onsubmit = function(e) {
            e.preventDefault();
            const formData = new FormData(form);
            let password = formData.get('password') || '';
            const confirmPassword = formData.get('confirmPassword') || '';
            if (password && password !== confirmPassword) {
                showNotification('Passwords do not match', 'error');
                return;
            }
            if (!password) {
                const email = formData.get('email') || '';
                password = email ? email.split('@')[0] : 'emp@' + String(CompanyData.employees.length + 1).padStart(3, '0');
            }
            const photoData = document.getElementById('photoPreview')?.getAttribute('data-photo') || null;
            const newEmp = {
                id: 'EMP' + String(CompanyData.employees.length + 1).padStart(3, '0'),
                name: formData.get('name'),
                email: formData.get('email'),
                password: password,
                phone: formData.get('phone'),
                department: formData.get('department'),
                designation: formData.get('designation'),
                joiningDate: formData.get('joiningDate'),
                bloodGroup: formData.get('bloodGroup') || 'O+',
                address: formData.get('address') || '',
                project: formData.get('project') || 'Not assigned',
                reportingManager: formData.get('manager') || 'TBD',
                status: 'Active',
                progress: 0,
                attendance: 100,
                tasksCompleted: 0,
                tasksPending: 0,
                performance: 3.0,
                workHours: 8.0,
                checkIn: '09:00 AM',
                checkOut: '06:00 PM',
                image: photoData
            };

            if (!newEmp.name || !newEmp.email || !newEmp.phone || !newEmp.department || !newEmp.designation || !newEmp.joiningDate) {
                showNotification('Please fill all required fields', 'error');
                return;
            }

            CompanyData.employees.push(newEmp);
            saveEmployees();
            showNotification('Employee added successfully!', 'success');
            modal.classList.remove('active');
            form.reset();
            if (window.location.pathname.includes('employees.html')) {
                loadEmployeeTable();
            }
        };
    }
}

function editEmployee(id) {
    const emp = getEmployeeById(id);
    if (!emp) return;

    const modal = document.getElementById('addEmployeeModal');
    if (!modal) return;

    modal.classList.add('active');
    const form = document.getElementById('addEmployeeForm');
    if (!form) return;

    form.querySelector('[name="name"]').value = emp.name;
    form.querySelector('[name="email"]').value = emp.email;
    form.querySelector('[name="phone"]').value = emp.phone;
    form.querySelector('[name="department"]').value = emp.department;
    form.querySelector('[name="designation"]').value = emp.designation;
    form.querySelector('[name="joiningDate"]').value = emp.joiningDate;
    form.querySelector('[name="bloodGroup"]').value = emp.bloodGroup;
    form.querySelector('[name="address"]').value = emp.address || '';
    form.querySelector('[name="project"]').value = emp.project || '';
    form.querySelector('[name="manager"]').value = emp.reportingManager || '';
    const pwdField = form.querySelector('[name="password"]');
    const conPwdField = form.querySelector('[name="confirmPassword"]');
    if (pwdField) pwdField.value = emp.password || '';
    if (conPwdField) conPwdField.value = emp.password || '';

    if (emp.image) {
        const preview = document.getElementById('photoPreview');
        const img = document.getElementById('previewImg');
        const label = document.getElementById('photoName');
        if (preview) { preview.style.display = 'block'; preview.setAttribute('data-photo', emp.image); }
        if (img) img.src = emp.image;
        if (label) label.textContent = 'Current photo';
    }

    modal.querySelector('.modal-header h3').textContent = 'Edit Employee';

    form.onsubmit = function(e) {
        e.preventDefault();
        const formData = new FormData(form);
        emp.name = formData.get('name');
        emp.email = formData.get('email');
        emp.phone = formData.get('phone');
        emp.department = formData.get('department');
        emp.designation = formData.get('designation');
        emp.joiningDate = formData.get('joiningDate');
        emp.bloodGroup = formData.get('bloodGroup') || 'O+';
        emp.address = formData.get('address') || '';
        emp.project = formData.get('project') || 'Not assigned';
        emp.reportingManager = formData.get('manager') || 'TBD';
        const newPwd = formData.get('password');
        if (newPwd) emp.password = newPwd;
        const photoPreview = document.getElementById('photoPreview');
        if (photoPreview && photoPreview.getAttribute('data-photo')) {
            emp.image = photoPreview.getAttribute('data-photo');
        }

        saveEmployees();
        showNotification('Employee updated successfully!', 'success');
        modal.classList.remove('active');
        form.reset();
        modal.querySelector('.modal-header h3').textContent = 'Add New Employee';
        if (window.location.pathname.includes('employees.html')) {
            loadEmployeeTable();
        }
    };
}

function deleteEmployee(id) {
    const modal = document.getElementById('confirmModal');
    if (!modal) return;

    modal.classList.add('active');
    modal.querySelector('.confirm-dialog h3').textContent = 'Delete Employee?';
    modal.querySelector('.confirm-dialog p').textContent = 'Are you sure you want to delete this employee? This action cannot be undone.';

    const confirmBtn = modal.querySelector('.confirm-yes');
    const cancelBtn = modal.querySelector('.confirm-no');

    const newConfirmBtn = confirmBtn.cloneNode(true);
    const newCancelBtn = cancelBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
    cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);

    newConfirmBtn.addEventListener('click', function() {
        const idx = CompanyData.employees.findIndex(e => e.id === id);
        if (idx > -1) {
            CompanyData.employees.splice(idx, 1);
            saveEmployees();
            showNotification('Employee deleted successfully', 'success');
            if (window.location.pathname.includes('employees.html')) {
                loadEmployeeTable();
            }
        }
        modal.classList.remove('active');
    });

    newCancelBtn.addEventListener('click', function() {
        modal.classList.remove('active');
    });
}

function viewEmployee(id) {
    localStorage.setItem('viewEmployeeId', id);
    window.location.href = 'employee-details.html';
}

function initEmployeeDetails() {
    let empId = localStorage.getItem('viewEmployeeId');
    if (!empId) {
        const userData = localStorage.getItem('loggedInUser');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                if (user.role === 'employee' || user.id) {
                    empId = user.id;
                }
            } catch(e) {}
        }
    }
    if (!empId) empId = 'EMP001';
    const emp = getEmployeeById(empId);
    if (!emp) {
        document.querySelector('.page-content').innerHTML = '<div style="text-align:center;padding:60px;"><h2>Employee not found</h2></div>';
        return;
    }

    const userData = localStorage.getItem('loggedInUser');
    if (userData) {
        try {
            const user = JSON.parse(userData);
            if (user.role === 'employee') {
                const backBtn = document.querySelector('.page-header .btn-outline');
                if (backBtn) backBtn.style.display = 'none';
                const breadcrumb = document.querySelector('.breadcrumb');
                if (breadcrumb) breadcrumb.innerHTML = 'Home / My Profile';
            }
        } catch(e) {}
    }

    const project = getEmployeeProject(empId);
    const empReports = getReportsByEmployee(empId);
    const empAttendance = getAttendanceByEmployee(empId);
    const initials = getInitials(emp.name);
    const progressLevel = getProgressLevel(emp.progress);

    document.getElementById('detailName').textContent = emp.name;
    if (emp.image) {
        document.getElementById('detailInitials').innerHTML = '<img src="' + emp.image + '" alt="' + emp.name + '" style="width:50px;height:50px;border-radius:var(--radius);object-fit:cover;">';
    } else {
        document.getElementById('detailInitials').textContent = initials;
    }
    document.getElementById('detailId').textContent = emp.id;
    document.getElementById('detailDept').textContent = emp.department;
    document.getElementById('detailDesignation').textContent = emp.designation;

    document.getElementById('detEmail').textContent = emp.email;
    document.getElementById('detPhone').textContent = emp.phone;
    document.getElementById('detAddress').textContent = emp.address || 'N/A';

    document.getElementById('detDept').textContent = emp.department;
    document.getElementById('detDesig').textContent = emp.designation;
    document.getElementById('detManager').textContent = emp.reportingManager || 'N/A';
    document.getElementById('detJoining').textContent = formatDate(emp.joiningDate);

    document.getElementById('detProject').textContent = emp.project || 'Not assigned';
    document.getElementById('detProjectStatus').textContent = project ? project.status : 'N/A';

    document.getElementById('detAttendance').textContent = emp.attendance + '%';
    document.getElementById('detCompleted').textContent = emp.tasksCompleted;
    document.getElementById('detPending').textContent = emp.tasksPending;
    document.getElementById('detProgress').textContent = emp.progress + '%';

    const stars = '★'.repeat(Math.floor(emp.performance)) + '☆'.repeat(5 - Math.floor(emp.performance));
    document.getElementById('detRating').innerHTML = `<span class="rating-stars">${stars}</span> (${emp.performance})`;

    document.getElementById('workProgress').style.width = emp.progress + '%';
    document.getElementById('workProgressText').textContent = emp.progress + '% (' + progressLevel.text + ')';

    document.getElementById('attProgress').style.width = emp.attendance + '%';
    document.getElementById('attProgressText').textContent = emp.attendance + '%';

    const taskPct = emp.tasksCompleted + emp.tasksPending > 0
        ? Math.round(emp.tasksCompleted / (emp.tasksCompleted + emp.tasksPending) * 100) : 0;
    document.getElementById('taskProgress').style.width = taskPct + '%';
    document.getElementById('taskProgressText').textContent = taskPct + '%';

    const contribPct = emp.progress;
    document.getElementById('contribProgress').style.width = contribPct + '%';
    document.getElementById('contribProgressText').textContent = contribPct + '%';

    const perfPct = Math.round(emp.performance / 5 * 100);
    document.getElementById('perfProgress').style.width = perfPct + '%';
    document.getElementById('perfProgressText').textContent = perfPct + '%';

    const reportsList = document.getElementById('detailReports');
    if (reportsList && empReports.length > 0) {
        reportsList.innerHTML = empReports.map(r => `
            <div class="detail-row">
                <span class="label">${formatDate(r.date)}</span>
                <span class="value">
                    <span class="badge ${r.status === 'Approved' ? 'badge-success' : r.status === 'Rejected' ? 'badge-danger' : r.status === 'Pending' ? 'badge-warning' : 'badge-info'}">${r.status}</span>
                    - ${r.tasksCompleted}/${r.tasksCompleted + r.tasksPending} tasks
                </span>
            </div>
        `).join('');
    }

    const activities = document.getElementById('detailActivities');
    if (activities) {
        activities.innerHTML = empReports.slice(0, 5).map(r => `
            <div class="detail-row">
                <span class="label">${formatDate(r.date)}</span>
                <span class="value">${r.managerComments || 'No comments'}</span>
            </div>
        `).join('') || '<div class="detail-row"><span class="label">No recent activities</span></div>';
    }

    const circularEl = document.getElementById('circularProgress');
    if (circularEl) {
        const circ = emp.progress;
        const r = 34;
        const c = 2 * Math.PI * r;
        const offset = c - (circ / 100) * c;
        circularEl.innerHTML = `
            <svg width="80" height="80">
                <circle cx="40" cy="40" r="${r}" fill="none" stroke="var(--grey-200)" stroke-width="6"/>
                <circle cx="40" cy="40" r="${r}" fill="none" stroke="${circ >= 80 ? '#28a745' : circ >= 60 ? '#ff9800' : circ >= 30 ? '#ffc107' : '#dc3545'}" stroke-width="6" stroke-dasharray="${c}" stroke-dashoffset="${offset}" stroke-linecap="round"/>
            </svg>
            <span class="progress-value">${circ}%</span>
        `;
    }

    generateIdCard(emp);
}

function generateIdCard(emp) {
    const container = document.getElementById('idCardContainer');
    if (!container) return;
    const initials = getInitials(emp.name);
    container.innerHTML = `
        <div class="id-card" id="employeeIdCard">
            <div class="id-card-header">
                <div class="company-logo">PS</div>
                <h3>Project Slovers Private Limited</h3>
                <span>Employee Identification Card</span>
            </div>
            <div class="id-card-photo">
                ${emp.image ? '<img src="' + emp.image + '" alt="' + emp.name + '" style="width:70px;height:70px;border-radius:50%;object-fit:cover;border:4px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.1);margin:0 auto;display:block;">' : '<div class="emp-photo">' + initials + '</div>'}
            </div>
            <div class="id-card-body">
                <div class="info-row">
                    <span class="label">Full Name</span>
                    <span class="value">${emp.name}</span>
                </div>
                <div class="info-row">
                    <span class="label">Employee ID</span>
                    <span class="value">${emp.id}</span>
                </div>
                <div class="info-row">
                    <span class="label">Department</span>
                    <span class="value">${emp.department}</span>
                </div>
                <div class="info-row">
                    <span class="label">Designation</span>
                    <span class="value">${emp.designation}</span>
                </div>
                <div class="info-row">
                    <span class="label">Email</span>
                    <span class="value">${emp.email}</span>
                </div>
                <div class="info-row">
                    <span class="label">Phone</span>
                    <span class="value">${emp.phone}</span>
                </div>
                <div class="info-row">
                    <span class="label">Joining Date</span>
                    <span class="value">${formatDate(emp.joiningDate)}</span>
                </div>
                <div class="info-row">
                    <span class="label">Blood Group</span>
                    <span class="value">${emp.bloodGroup}</span>
                </div>
            </div>
            <div class="id-card-footer">
                <div class="qr-placeholder">QR Code</div>
                <div>
                    <div>Valid Until: ${new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</div>
                    <div style="font-size:9px;">Issued by Project Slovers Private Limited</div>
                </div>
            </div>
        </div>
    `;
}

function printIdCard() {
    const card = document.getElementById('employeeIdCard');
    if (!card) return;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`
        <html><head><title>Employee ID Card</title>
        <style>
            body { font-family: 'Segoe UI', sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #f0f2f5; }
            .id-card { background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.15); max-width: 350px; width: 100%; }
            .id-card-header { background: linear-gradient(135deg, #1a237e, #0d1442); color: white; padding: 20px; text-align: center; }
            .id-card-header .company-logo { width: 50px; height: 50px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #1a237e; font-weight: 800; font-size: 20px; margin: 0 auto 8px; }
            .id-card-header h3 { font-size: 14px; }
            .id-card-header span { font-size: 11px; opacity: 0.8; }
            .id-card-photo { text-align: center; margin-top: -30px; }
            .id-card-photo .emp-photo { width: 70px; height: 70px; border-radius: 50%; background: #283593; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 24px; margin: 0 auto; border: 4px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
            .id-card-body { padding: 16px 20px 20px; }
            .id-card-body .info-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #eee; font-size: 13px; }
            .id-card-body .info-row:last-child { border-bottom: none; }
            .id-card-body .info-row .label { color: #6c757d; }
            .id-card-body .info-row .value { font-weight: 600; color: #212529; }
            .id-card-footer { background: #f8f9fa; padding: 12px 20px; display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #6c757d; }
            .qr-placeholder { width: 50px; height: 50px; background: white; border: 2px dashed #ced4da; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #6c757d; }
        </style>
        </head><body>${card.outerHTML}</body></html>
    `);
    win.document.close();
    setTimeout(() => { win.print(); }, 500);
}

function initReports() {
    loadReportsTable();
    setupReportFilters();
}

function loadReportsTable() {
    const tbody = document.getElementById('reportsTableBody');
    if (!tbody) return;

    const statusFilter = document.getElementById('reportStatusFilter')?.value || 'all';

    let filtered = [...CompanyData.reports];
    if (statusFilter !== 'all') {
        filtered = filtered.filter(r => r.status === statusFilter);
    }

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="10" style="text-align:center;padding:40px;color:var(--grey-500);">No reports found</td></tr>`;
        return;
    }

    tbody.innerHTML = filtered.map(r => `
        <tr>
            <td>${r.id}</td>
            <td>${r.employeeName}</td>
            <td>${r.employeeId}</td>
            <td>${r.project}</td>
            <td>${formatDate(r.date)}</td>
            <td>${r.tasksCompleted}</td>
            <td>${r.tasksPending}</td>
            <td>${r.workingHours}h</td>
            <td>
                <div class="progress-bar">
                    <div class="progress-fill ${getProgressLevel(r.progress).class}" style="width:${r.progress}%"></div>
                </div>
                <span style="font-size:12px;">${r.progress}%</span>
            </td>
            <td>
                <span class="badge ${r.status === 'Approved' ? 'badge-success' : r.status === 'Rejected' ? 'badge-danger' : r.status === 'Pending' ? 'badge-warning' : 'badge-info'}">${r.status}</span>
            </td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="viewReport('${r.id}')">View</button>
                ${r.status !== 'Approved' ? `<button class="btn btn-success btn-sm" onclick="approveReport('${r.id}')" style="margin-top:4px;">Approve</button>` : ''}
                ${r.status !== 'Rejected' ? `<button class="btn btn-danger btn-sm" onclick="rejectReport('${r.id}')" style="margin-top:4px;">Reject</button>` : ''}
                <button class="btn btn-outline btn-sm" onclick="downloadReport('${r.id}')" style="margin-top:4px;">Download</button>
            </td>
        </tr>
    `).join('');
}

function setupReportFilters() {
    const filter = document.getElementById('reportStatusFilter');
    if (filter) {
        filter.addEventListener('change', loadReportsTable);
    }
}

function viewReport(id) {
    const report = CompanyData.reports.find(r => r.id === id);
    if (!report) return;
    const modal = document.getElementById('reportModal');
    if (!modal) return;
    modal.classList.add('active');
    document.getElementById('reportModalBody').innerHTML = `
        <div class="detail-card" style="box-shadow:none;padding:0;">
            <div class="detail-row"><span class="label">Report ID</span><span class="value">${report.id}</span></div>
            <div class="detail-row"><span class="label">Employee</span><span class="value">${report.employeeName} (${report.employeeId})</span></div>
            <div class="detail-row"><span class="label">Project</span><span class="value">${report.project}</span></div>
            <div class="detail-row"><span class="label">Date</span><span class="value">${formatDate(report.date)}</span></div>
            <div class="detail-row"><span class="label">Tasks Completed</span><span class="value">${report.tasksCompleted}</span></div>
            <div class="detail-row"><span class="label">Tasks Pending</span><span class="value">${report.tasksPending}</span></div>
            <div class="detail-row"><span class="label">Working Hours</span><span class="value">${report.workingHours}h</span></div>
            <div class="detail-row"><span class="label">Progress</span><span class="value">${report.progress}%</span></div>
            <div class="detail-row"><span class="label">Manager Comments</span><span class="value">${report.managerComments || 'No comments'}</span></div>
            <div class="detail-row"><span class="label">Status</span><span class="value"><span class="badge ${report.status === 'Approved' ? 'badge-success' : report.status === 'Rejected' ? 'badge-danger' : report.status === 'Pending' ? 'badge-warning' : 'badge-info'}">${report.status}</span></span></div>
        </div>
    `;
}

function approveReport(id) {
    const report = CompanyData.reports.find(r => r.id === id);
    if (report) {
        report.status = 'Approved';
        showNotification('Report ' + id + ' approved successfully!', 'success');
        loadReportsTable();
    }
}

function rejectReport(id) {
    const report = CompanyData.reports.find(r => r.id === id);
    if (report) {
        report.status = 'Rejected';
        showNotification('Report ' + id + ' has been rejected', 'warning');
        loadReportsTable();
    }
}

function downloadReport(id) {
    const report = CompanyData.reports.find(r => r.id === id);
    if (!report) return;
    const content = `Report ID: ${report.id}\nEmployee: ${report.employeeName} (${report.employeeId})\nProject: ${report.project}\nDate: ${formatDate(report.date)}\nTasks Completed: ${report.tasksCompleted}\nTasks Pending: ${report.tasksPending}\nWorking Hours: ${report.workingHours}h\nProgress: ${report.progress}%\nManager Comments: ${report.managerComments || 'N/A'}\nStatus: ${report.status}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Report_${id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Report downloaded successfully', 'success');
}

function initProjects() {
    let empId = null;
    const userData = localStorage.getItem('loggedInUser');
    if (userData) {
        try {
            const user = JSON.parse(userData);
            if (user.role === 'employee') {
                empId = user.id;
                const h2 = document.querySelector('.page-header h2');
                const breadcrumb = document.querySelector('.breadcrumb');
                if (h2) h2.textContent = 'My Project';
                if (breadcrumb) breadcrumb.textContent = 'Home / My Project';
                const tblHeader = document.querySelector('.table-card .table-header h3');
                if (tblHeader) tblHeader.textContent = 'Project Details';
            }
        } catch(e) {}
    }
    loadProjects(empId);
}

function loadProjects(empId) {
    let projects = CompanyData.projects;
    if (empId) {
        projects = projects.filter(p => p.team.includes(empId));
    }
    const container = document.getElementById('projectCards');
    const tbody = document.getElementById('projectsTableBody');

    if (container) {
        container.innerHTML = projects.map(p => {
            const days = getDaysRemaining(p.deadline);
            const statusColor = getStatusColor(p.status);
            return `<div class="project-card fade-in-up">
                <div class="project-header">
                    <h4>${p.name}</h4>
                    <span class="badge" style="background:${statusColor}22;color:${statusColor};border:1px solid ${statusColor}44;">${p.status}</span>
                </div>
                <div class="project-meta">
                    <div class="meta-item"><div class="meta-label">Project ID</div><div class="meta-value">${p.id}</div></div>
                    <div class="meta-item"><div class="meta-label">Manager</div><div class="meta-value">${p.manager}</div></div>
                    <div class="meta-item"><div class="meta-label">Team Size</div><div class="meta-value">${p.team.length} members</div></div>
                    <div class="meta-item"><div class="meta-label">Priority</div><div class="meta-value" style="color:${getPriorityColor(p.priority)}">${p.priority}</div></div>
                    <div class="meta-item"><div class="meta-label">Start</div><div class="meta-value">${formatDate(p.startDate)}</div></div>
                    <div class="meta-item"><div class="meta-label">Deadline</div><div class="meta-value">${formatDate(p.deadline)}</div></div>
                </div>
                <div class="progress-bar" style="margin-bottom:4px;">
                    <div class="progress-fill ${p.completion >= 80 ? 'green' : p.completion >= 50 ? 'blue' : p.completion >= 20 ? 'orange' : 'red'}" style="width:${p.completion}%"></div>
                </div>
                <div class="progress-text">
                    <span>${p.completion}% complete</span>
                    <span style="color:${days <= 30 ? 'var(--danger)' : 'var(--grey-500)'}">${days} days left</span>
                </div>
            </div>`;
        }).join('');
    }

    if (tbody) {
        tbody.innerHTML = projects.map(p => {
            const days = getDaysRemaining(p.deadline);
            return `<tr>
                <td style="font-weight:600;">${p.name}</td>
                <td>${p.id}</td>
                <td>${p.manager}</td>
                <td>${p.team.length}</td>
                <td>${formatDate(p.startDate)}</td>
                <td>${formatDate(p.deadline)}</td>
                <td><span class="badge" style="background:${getStatusColor(p.status)}22;color:${getStatusColor(p.status)}">${p.status}</span></td>
                <td><span style="color:${getPriorityColor(p.priority)};font-weight:600;">${p.priority}</span></td>
                <td>
                    <div class="progress-bar">
                        <div class="progress-fill ${p.completion >= 80 ? 'green' : p.completion >= 50 ? 'blue' : p.completion >= 20 ? 'orange' : 'red'}" style="width:${p.completion}%"></div>
                    </div>
                    <span style="font-size:12px;">${p.completion}%</span>
                </td>
                <td><span style="color:${days <= 30 ? 'var(--danger)' : 'var(--grey-500)'}">${days} days</span></td>
            </tr>`;
        }).join('');
    }
}

function initAttendance() {
    let empId = null;
    const userData = localStorage.getItem('loggedInUser');
    if (userData) {
        try {
            const user = JSON.parse(userData);
            if (user.role === 'employee') {
                empId = user.id;
                const h2 = document.querySelector('.page-header h2');
                const breadcrumb = document.querySelector('.breadcrumb');
                if (h2) h2.textContent = 'My Attendance';
                if (breadcrumb) breadcrumb.textContent = 'Home / My Attendance';
            }
        } catch(e) {}
    }
    loadAttendance(empId);
    setupAttendanceFilters(empId);
}

function loadAttendance(empId) {
    let records = CompanyData.attendance;
    if (empId) {
        records = records.filter(a => a.employeeId === empId);
    }
    const present = records.filter(a => a.status === 'Present').length;
    const absent = records.filter(a => a.status === 'Absent').length;
    const leave = records.filter(a => a.status === 'On Leave').length;
    const late = records.filter(a => a.status === 'Late').length;
    const totalHours = records.reduce((s, a) => s + a.hours, 0).toFixed(1);

    document.getElementById('statPresent') && (document.getElementById('statPresent').textContent = present);
    document.getElementById('statAbsent') && (document.getElementById('statAbsent').textContent = absent);
    document.getElementById('statLeave') && (document.getElementById('statLeave').textContent = leave);
    document.getElementById('statLate') && (document.getElementById('statLate').textContent = late);
    document.getElementById('statHours') && (document.getElementById('statHours').textContent = totalHours + 'h');

    loadAttendanceEmployeeTable(empId);
    loadAttendanceDailyTable(empId);
}

function loadAttendanceEmployeeTable(empId) {
    const tbody = document.getElementById('attendanceEmpBody');
    if (!tbody) return;

    let filtered = [...CompanyData.employees];
    if (empId) {
        filtered = filtered.filter(e => e.id === empId);
    } else {
        const deptFilter = document.getElementById('attDeptFilter')?.value || 'all';
        const statusFilter = document.getElementById('attStatusFilter')?.value || 'all';
        if (deptFilter !== 'all') filtered = filtered.filter(e => e.department === deptFilter);
        if (statusFilter !== 'all') filtered = filtered.filter(e => e.status === statusFilter);
    }

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:40px;color:var(--grey-500);">No employees found</td></tr>`;
        return;
    }

    tbody.innerHTML = filtered.map(emp => {
        const initials = getInitials(emp.name);
        const progressLevel = getProgressLevel(emp.progress);
        return `<tr>
            <td>
                <div class="user-cell">
                    ${getEmployeeAvatarSmall(emp)}
                    <div class="user-details">
                        <div class="user-name">${emp.name}</div>
                        <div class="user-sub">${emp.id}</div>
                    </div>
                </div>
            </td>
            <td>${emp.department}</td>
            <td>${emp.attendance}%</td>
            <td>${emp.checkIn}</td>
            <td>${emp.checkOut}</td>
            <td>${emp.workHours}h</td>
            <td>
                <div class="progress-bar" style="min-width:80px;">
                    <div class="progress-fill ${progressLevel.class}" style="width:${emp.progress}%"></div>
                </div>
                <span style="font-size:12px;">${emp.progress}% (${progressLevel.text})</span>
            </td>
            <td><span class="badge ${emp.status === 'Active' ? 'badge-success' : 'badge-warning'}">${emp.status}</span></td>
        </tr>`;
    }).join('');
}

function loadAttendanceDailyTable(empId) {
    const tbody = document.getElementById('attendanceTableBody');
    if (!tbody) return;

    let records = CompanyData.attendance;
    if (empId) {
        records = records.filter(a => a.employeeId === empId);
    }

    tbody.innerHTML = records.map(a => {
        const emp = getEmployeeById(a.employeeId);
        const avatarHtml = emp ? getEmployeeAvatarSmall(emp) : '<div class="user-avatar" style="width:32px;height:32px;font-size:11px;">??</div>';
        return `<tr>
            <td>
                <div class="user-cell">
                    ${avatarHtml}
                    <div class="user-details">
                        <div class="user-name">${emp ? emp.name : 'Unknown'}</div>
                    </div>
                </div>
            </td>
            <td>${a.employeeId}</td>
            <td>${formatDate(a.date)}</td>
            <td>${a.checkIn}</td>
            <td>${a.checkOut}</td>
            <td>${a.hours}h</td>
            <td><span class="badge ${a.status === 'Present' ? 'badge-success' : a.status === 'Late' ? 'badge-orange' : a.status === 'On Leave' ? 'badge-warning' : 'badge-danger'}">${a.status}</span></td>
        </tr>`;
    }).join('');
}

function setupAttendanceFilters(empId) {
    const deptFilter = document.getElementById('attDeptFilter');
    const statusFilter = document.getElementById('attStatusFilter');

    if (empId) {
        if (deptFilter) deptFilter.style.display = 'none';
        if (statusFilter) statusFilter.style.display = 'none';
        return;
    }

    if (deptFilter) {
        deptFilter.innerHTML = '<option value="all">All Departments</option>' +
            CompanyData.departments.map(d => `<option value="${d}">${d}</option>`).join('');
        deptFilter.addEventListener('change', function() { loadAttendanceEmployeeTable(); });
    }
    if (statusFilter) {
        statusFilter.addEventListener('change', function() { loadAttendanceEmployeeTable(); });
    }
}

function submitEmployeeReport(event) {
    if (event) event.preventDefault();
    const form = document.getElementById('reportForm');
    if (!form) return;

    const empId = form.querySelector('[name="empId"]')?.value.trim();
    const empName = form.querySelector('[name="empName"]')?.value.trim();
    const project = form.querySelector('[name="project"]')?.value.trim();
    const date = form.querySelector('[name="reportDate"]')?.value;
    const workDone = form.querySelector('[name="workDone"]')?.value.trim();
    const workingHours = form.querySelector('[name="workingHours"]')?.value;
    const progress = form.querySelector('[name="progress"]')?.value;

    if (!empId || !empName || !project || !date || !workDone || !workingHours || !progress) {
        showNotification('Please fill all required fields', 'error');
        return false;
    }

    const newReport = {
        id: 'RPT' + String(CompanyData.reports.length + 1).padStart(3, '0'),
        employeeId: empId,
        employeeName: empName,
        project: project,
        date: date,
        tasksCompleted: form.querySelector('[name="tasksCompleted"]')?.value || 0,
        tasksPending: form.querySelector('[name="tasksPending"]')?.value || 0,
        workingHours: parseFloat(workingHours),
        progress: parseInt(progress),
        managerComments: '',
        status: 'Submitted'
    };

    CompanyData.reports.push(newReport);
    saveReports();
    showNotification('Report submitted successfully!', 'success');
    form.reset();
    return false;
}

function saveReports() {
    localStorage.setItem('companyPortalReports', JSON.stringify(CompanyData.reports));
}

function showNotification(message, type) {
    const container = document.getElementById('notificationContainer');
    if (!container) {
        const div = document.createElement('div');
        div.id = 'notificationContainer';
        div.className = 'notification';
        document.body.appendChild(div);
    }
    const c = document.getElementById('notificationContainer');
    const item = document.createElement('div');
    item.className = 'notification-item ' + type;
    item.innerHTML = `<span>${message}</span><button class="close-notif" onclick="this.parentElement.remove()">&times;</button>`;
    c.appendChild(item);
    setTimeout(() => {
        if (item.parentElement) item.remove();
    }, 4000);
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
}

function showChangePasswordModal() {
    const section = document.getElementById('changePwdSection');
    if (section) section.style.display = 'block';
}

function hideChangePassword() {
    const section = document.getElementById('changePwdSection');
    if (section) {
        section.style.display = 'none';
        document.getElementById('curPwd') && (document.getElementById('curPwd').value = '');
        document.getElementById('newPwd') && (document.getElementById('newPwd').value = '');
        document.getElementById('conPwd') && (document.getElementById('conPwd').value = '');
    }
}

function saveNewPassword() {
    const curPwd = document.getElementById('curPwd')?.value;
    const newPwd = document.getElementById('newPwd')?.value;
    const conPwd = document.getElementById('conPwd')?.value;

    if (!curPwd || !newPwd || !conPwd) {
        showNotification('Please fill all password fields', 'error');
        return;
    }
    if (newPwd !== conPwd) {
        showNotification('New passwords do not match', 'error');
        return;
    }
    if (newPwd.length < 4) {
        showNotification('Password must be at least 4 characters', 'error');
        return;
    }

    const userData = localStorage.getItem('loggedInUser');
    if (!userData) {
        showNotification('Please login first', 'error');
        return;
    }
    const user = JSON.parse(userData);
    const emp = CompanyData.employees.find(e => e.id === user.id);
    if (!emp) {
        showNotification('Employee not found', 'error');
        return;
    }
    if (emp.password !== curPwd) {
        showNotification('Current password is incorrect', 'error');
        return;
    }

    emp.password = newPwd;
    saveEmployees();
    showNotification('Password updated successfully!', 'success');
    hideChangePassword();
}

function forgotPassword() {
    const empId = document.getElementById('empId')?.value.trim();
    if (!empId) {
        showNotification('Please enter your Employee ID or Email first', 'error');
        return;
    }
    const emp = CompanyData.employees.find(e => e.id === empId || e.email === empId);
    if (!emp) {
        showNotification('Employee not found with this ID/Email', 'error');
        return;
    }

    const code = Math.floor(100000 + Math.random() * 900000);
    const demoMsg = document.getElementById('demoMsg');
    if (demoMsg) {
        demoMsg.innerHTML = 'Verification code sent to <strong>' + emp.email + '</strong><br>'
            + 'Your code: <strong style="font-size:20px;letter-spacing:4px;">' + code + '</strong><br>'
            + '<small>(Demo: In production, this would be emailed to you)</small><br><br>'
            + '<div class="form-group"><label>Enter Code</label>'
            + '<input type="text" id="verifyCode" placeholder="Enter 6-digit code" style="width:100%;padding:10px;border:1px solid var(--grey-300);border-radius:var(--radius-sm);text-align:center;font-size:18px;letter-spacing:6px;"></div>'
            + '<button class="btn btn-primary btn-sm" onclick="verifyResetCode(' + code + ',\'' + emp.id + '\')" style="width:100%;">Verify &amp; Reset Password</button>';
    }
    showNotification('Verification code sent to ' + emp.email, 'info');
}

function verifyResetCode(expectedCode, empId) {
    const entered = document.getElementById('verifyCode')?.value.trim();
    if (String(entered) !== String(expectedCode)) {
        showNotification('Invalid verification code. Please try again.', 'error');
        return;
    }
    const emp = CompanyData.employees.find(e => e.id === empId);
    if (!emp) {
        showNotification('Employee not found', 'error');
        return;
    }

    const defaultPwd = emp.email.split('@')[0];
    emp.password = defaultPwd;
    saveEmployees();

    const demoMsg = document.getElementById('demoMsg');
    if (demoMsg) {
        demoMsg.innerHTML = 'Password reset successful!<br>Your new password: <strong>' + defaultPwd + '</strong><br>'
            + '<small>Please login with your new password</small>';
    }
    showNotification('Password reset successful! Check demo message for new password.', 'success');
}

function showPasswordSetup() {
    const demoMsg = document.getElementById('demoMsg');
    if (!demoMsg) return;
    demoMsg.innerHTML = '<strong>First Time Password Setup</strong><br><br>'
        + '<div class="form-group"><label>Employee ID or Email</label>'
        + '<input type="text" id="setupEmpId" placeholder="Enter your Employee ID or Email" style="width:100%;padding:10px;border:1px solid var(--grey-300);border-radius:var(--radius-sm);"></div>'
        + '<button class="btn btn-primary btn-sm" onclick="sendSetupCode()" style="width:100%;">Send Verification Code</button>';
}

function sendSetupCode() {
    const input = document.getElementById('setupEmpId')?.value.trim();
    if (!input) {
        showNotification('Please enter your Employee ID or Email', 'error');
        return;
    }
    const emp = CompanyData.employees.find(e => e.id === input || e.email === input);
    if (!emp) {
        showNotification('Employee not found. Contact your administrator.', 'error');
        return;
    }
    if (emp.password && emp.password !== 'emp@' + emp.id.slice(3).toLowerCase()) {
        showNotification('Password already set. Use "Forgot Password" to reset.', 'info');
        return;
    }

    const code = Math.floor(100000 + Math.random() * 900000);
    const demoMsg = document.getElementById('demoMsg');
    if (demoMsg) {
        demoMsg.innerHTML = 'Verification code sent to <strong>' + emp.email + '</strong><br>'
            + 'Your code: <strong style="font-size:20px;letter-spacing:4px;">' + code + '</strong><br>'
            + '<small>(Demo: In production, this would be emailed to you)</small><br><br>'
            + '<div class="form-group"><label>Enter Code</label>'
            + '<input type="text" id="setupVerifyCode" placeholder="Enter 6-digit code" style="width:100%;padding:10px;border:1px solid var(--grey-300);border-radius:var(--radius-sm);text-align:center;font-size:18px;letter-spacing:6px;"></div>'
            + '<div class="form-group"><label>New Password</label>'
            + '<input type="password" id="setupNewPwd" placeholder="Create a password (min 4 chars)" style="width:100%;padding:10px;border:1px solid var(--grey-300);border-radius:var(--radius-sm);"></div>'
            + '<div class="form-group"><label>Confirm Password</label>'
            + '<input type="password" id="setupConPwd" placeholder="Confirm your password" style="width:100%;padding:10px;border:1px solid var(--grey-300);border-radius:var(--radius-sm);"></div>'
            + '<button class="btn btn-primary btn-sm" onclick="completePasswordSetup(' + code + ',\'' + emp.id + '\')" style="width:100%;">Set Password</button>';
    }
    showNotification('Verification code sent to ' + emp.email, 'info');
}

function completePasswordSetup(expectedCode, empId) {
    const entered = document.getElementById('setupVerifyCode')?.value.trim();
    const newPwd = document.getElementById('setupNewPwd')?.value;
    const conPwd = document.getElementById('setupConPwd')?.value;

    if (String(entered) !== String(expectedCode)) {
        showNotification('Invalid verification code', 'error');
        return;
    }
    if (!newPwd || newPwd.length < 4) {
        showNotification('Password must be at least 4 characters', 'error');
        return;
    }
    if (newPwd !== conPwd) {
        showNotification('Passwords do not match', 'error');
        return;
    }

    const emp = CompanyData.employees.find(e => e.id === empId);
    if (!emp) {
        showNotification('Employee not found', 'error');
        return;
    }

    emp.password = newPwd;
    saveEmployees();

    const demoMsg = document.getElementById('demoMsg');
    if (demoMsg) {
        demoMsg.innerHTML = 'Password set successfully!<br>You can now login with your new password.<br><br>'
            + '<button class="btn btn-primary btn-sm" onclick="window.location.href=\'login.html\'" style="width:100%;">Go to Login</button>';
    }
    showNotification('Password created successfully! You can now login.', 'success');
}

function logout() {
    localStorage.removeItem('loggedInUser');
    showNotification('Logged out successfully', 'info');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 500);
}

function initAnalysis() {
    loadAnalysisSummary();
    loadAnalysisCharts();
    loadAnalysisTable();
    setupAnalysisFilters();
}

function loadAnalysisSummary() {
    const employees = CompanyData.employees;
    const total = employees.length;

    const avgPerf = total ? employees.reduce((s, e) => s + e.performance, 0) / total : 0;
    const avgProg = total ? Math.round(employees.reduce((s, e) => s + e.progress, 0) / total) : 0;
    const avgAtt = total ? Math.round(employees.reduce((s, e) => s + e.attendance, 0) / total) : 0;
    const totalReports = CompanyData.reports.length;
    const needsImprovement = employees.filter(e => e.progress <= 30).length;
    const topPerf = employees.filter(e => e.performance >= 4.5).length;

    document.getElementById('anlAvgPerformance').textContent = avgPerf.toFixed(1);
    document.getElementById('anlAvgProgress').textContent = avgProg + '%';
    document.getElementById('anlAvgAttendance').textContent = avgAtt + '%';
    document.getElementById('anlTotalReports').textContent = totalReports;
    document.getElementById('anlNeedsImprovement').textContent = needsImprovement;
    document.getElementById('anlTopPerformers').textContent = topPerf;
}

function loadAnalysisCharts() {
    createDeptPerfChart();
    createDeptCountChart();
    createPerfDistChart();
    createProgressBracketChart();
    createAttendanceSummaryChart();
    createReportStatusChart();
}

function createDeptPerfChart() {
    const ctx = document.getElementById('deptPerfChart');
    if (!ctx) return;
    const depts = CompanyData.departments;
    const avgPerf = depts.map(d => {
        const emps = CompanyData.employees.filter(e => e.department === d);
        return emps.length ? emps.reduce((s, e) => s + e.performance, 0) / emps.length : 0;
    });
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: depts,
            datasets: [{
                label: 'Avg Performance (out of 5)',
                data: avgPerf,
                backgroundColor: ['#1976d2','#28a745','#ff9800','#dc3545','#7b1fa2','#00796b','#e91e63','#ffc107','#00acc1','#6c757d'],
                borderRadius: 4
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, max: 5, grid: { color: 'rgba(0,0,0,0.05)' } }, x: { grid: { display: false }, ticks: { font: { size: 10 } } } }
        }
    });
}

function createDeptCountChart() {
    const ctx = document.getElementById('deptCountChart');
    if (!ctx) return;
    const depts = CompanyData.departments;
    const counts = depts.map(d => CompanyData.employees.filter(e => e.department === d).length);
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: depts,
            datasets: [{
                label: 'Employees',
                data: counts,
                backgroundColor: '#1976d2',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } }, x: { grid: { display: false }, ticks: { font: { size: 10 } } } }
        }
    });
}

function createPerfDistChart() {
    const ctx = document.getElementById('perfDistChart');
    if (!ctx) return;
    const e = CompanyData.employees;
    const dist = [
        e.filter(x => x.performance < 3).length,
        e.filter(x => x.performance >= 3 && x.performance < 3.5).length,
        e.filter(x => x.performance >= 3.5 && x.performance < 4).length,
        e.filter(x => x.performance >= 4 && x.performance < 4.5).length,
        e.filter(x => x.performance >= 4.5).length
    ];
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['< 3.0', '3.0 - 3.4', '3.5 - 3.9', '4.0 - 4.4', '4.5 - 5.0'],
            datasets: [{
                label: 'Employees',
                data: dist,
                backgroundColor: ['#dc3545','#ff9800','#ffc107','#2196f3','#28a745'],
                borderRadius: 4
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } }, x: { grid: { display: false } } }
        }
    });
}

function createProgressBracketChart() {
    const ctx = document.getElementById('progressBracketChart');
    if (!ctx) return;
    const e = CompanyData.employees;
    const brackets = [
        e.filter(x => x.progress <= 30).length,
        e.filter(x => x.progress > 30 && x.progress <= 60).length,
        e.filter(x => x.progress > 60 && x.progress <= 80).length,
        e.filter(x => x.progress > 80).length
    ];
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Needs Improvement (0-30%)', 'Average (31-60%)', 'Good (61-80%)', 'Excellent (81-100%)'],
            datasets: [{
                data: brackets,
                backgroundColor: ['#dc3545','#ffc107','#ff9800','#28a745'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { padding: 12, font: { size: 11 }, usePointStyle: true } } },
            cutout: '60%'
        }
    });
}

function createAttendanceSummaryChart() {
    const ctx = document.getElementById('attendanceSummaryChart');
    if (!ctx) return;
    const present = CompanyData.attendance.filter(a => a.status === 'Present').length;
    const absent = CompanyData.attendance.filter(a => a.status === 'Absent').length;
    const late = CompanyData.attendance.filter(a => a.status === 'Late').length;
    const leave = CompanyData.attendance.filter(a => a.status === 'On Leave').length;
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Present', 'Absent', 'Late', 'On Leave'],
            datasets: [{
                data: [present, absent, late, leave],
                backgroundColor: ['#28a745','#dc3545','#ff9800','#ffc107'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { padding: 12, font: { size: 11 }, usePointStyle: true } } }
        }
    });
}

function createReportStatusChart() {
    const ctx = document.getElementById('reportStatusChart');
    if (!ctx) return;
    const r = CompanyData.reports;
    const statuses = ['Submitted', 'Pending', 'Approved', 'Rejected'];
    const counts = statuses.map(s => r.filter(x => x.status === s).length);
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: statuses,
            datasets: [{
                data: counts,
                backgroundColor: ['#2196f3','#ffc107','#28a745','#dc3545'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { padding: 12, font: { size: 11 }, usePointStyle: true } } },
            cutout: '60%'
        }
    });
}

function loadAnalysisTable() {
    const tbody = document.getElementById('analysisTableBody');
    if (!tbody) return;

    const deptFilter = document.getElementById('analysisDeptFilter')?.value || 'all';
    const sortBy = document.getElementById('analysisSortBy')?.value || 'performance';

    let filtered = [...CompanyData.employees];
    if (deptFilter !== 'all') {
        filtered = filtered.filter(e => e.department === deptFilter);
    }

    filtered.sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'progress') return b.progress - a.progress;
        if (sortBy === 'attendance') return b.attendance - a.attendance;
        return b.performance - a.performance;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--grey-500);">No employees found</td></tr>`;
        return;
    }

    tbody.innerHTML = filtered.map(emp => {
        const overall = Math.round((emp.performance / 5 * 40) + (emp.progress * 0.3) + (emp.attendance * 0.3));
        return `<tr>
            <td>
                <div class="user-cell">
                    ${getEmployeeAvatar(emp)}
                    <div class="user-details">
                        <div class="user-name">${emp.name}</div>
                        <div class="user-sub">${emp.id}</div>
                    </div>
                </div>
            </td>
            <td>${emp.department}</td>
            <td><span class="rating-stars">${'★'.repeat(Math.floor(emp.performance))}${'☆'.repeat(5 - Math.floor(emp.performance))}</span> (${emp.performance})</td>
            <td>
                <div class="progress-bar" style="min-width:80px;">
                    <div class="progress-fill ${emp.progress >= 80 ? 'green' : emp.progress >= 60 ? 'blue' : emp.progress >= 30 ? 'orange' : 'red'}" style="width:${emp.progress}%"></div>
                </div>
                <span style="font-size:12px;">${emp.progress}%</span>
            </td>
            <td>${emp.attendance}%</td>
            <td><span class="badge ${emp.status === 'Active' ? 'badge-success' : 'badge-warning'}">${emp.status}</span></td>
            <td style="font-weight:600;color:${overall >= 80 ? 'var(--success)' : overall >= 60 ? 'var(--orange)' : 'var(--danger)'}">${overall}</td>
        </tr>`;
    }).join('');

    loadTopPerformers(filtered);
    loadDeptOverview();
}

function loadTopPerformers(employees) {
    const container = document.getElementById('topPerformersList');
    if (!container) return;
    const top = [...employees].sort((a, b) => b.performance - a.performance).slice(0, 5);
    if (top.length === 0) {
        container.innerHTML = '<div class="detail-row"><span class="label">No data</span></div>';
        return;
    }
    container.innerHTML = top.map((emp, i) => `
        <div class="detail-row">
            <span class="label">${i + 1}. ${emp.name}</span>
            <span class="value" style="color:var(--warning);">${'★'.repeat(Math.floor(emp.performance))}${'☆'.repeat(5 - Math.floor(emp.performance))}</span>
        </div>
    `).join('');
}

function loadDeptOverview() {
    const container = document.getElementById('deptOverviewList');
    if (!container) return;
    container.innerHTML = CompanyData.departments.map(d => {
        const emps = CompanyData.employees.filter(e => e.department === d);
        const count = emps.length;
        const avgPerf = count ? (emps.reduce((s, e) => s + e.performance, 0) / count).toFixed(1) : '0.0';
        const avgProg = count ? Math.round(emps.reduce((s, e) => s + e.progress, 0) / count) : 0;
        return `
            <div class="detail-row">
                <span class="label">${d} (${count})</span>
                <span class="value" style="font-size:12px;">Perf: ${avgPerf} | Prog: ${avgProg}%</span>
            </div>
        `;
    }).join('');
}

function setupAnalysisFilters() {
    const deptFilter = document.getElementById('analysisDeptFilter');
    const sortBy = document.getElementById('analysisSortBy');
    if (deptFilter) {
        deptFilter.innerHTML = '<option value="all">All Departments</option>' +
            CompanyData.departments.map(d => `<option value="${d}">${d}</option>`).join('');
        deptFilter.addEventListener('change', loadAnalysisTable);
    }
    if (sortBy) {
        sortBy.addEventListener('change', loadAnalysisTable);
    }
}

function exportAnalysisData() {
    let csv = 'Name,ID,Department,Performance,Progress,Attendance,Status\n';
    CompanyData.employees.forEach(e => {
        csv += `"${e.name}","${e.id}","${e.department}",${e.performance},${e.progress},${e.attendance},"${e.status}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Employee_Analysis_Data.csv';
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Analysis data exported successfully', 'success');
}

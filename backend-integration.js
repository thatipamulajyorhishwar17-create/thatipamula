// Backend Integration - Overrides script.js functions to use API
// Load this AFTER api.js, data.js, and script.js

// ====== OVERRIDE: Auth & User Management ======

// Override checkAuth to use token-based auth
const originalCheckAuth = window.checkAuth;
window.checkAuth = function() {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    const token = getToken();
    const user = getStoredUser();

    if (page !== 'login.html' && page !== 'index.html' && !token) {
        window.location.href = 'login.html';
        return;
    }
    if ((page === 'login.html' || page === 'index.html') && token && user) {
        window.location.href = 'dashboard.html';
        return;
    }

    // Sync old localStorage format for sidebar/etc compatibility
    if (user) {
        localStorage.setItem('loggedInUser', JSON.stringify(user));
    }
};

// Save original initLogin for fallback
const originalInitLogin = window.initLogin;

// Override initLogin to use API with fallback to local auth
window.initLogin = async function() {
    const form = document.getElementById('loginForm');
    if (!form) return;

    // Set demo credentials message
    const demoMsg = document.getElementById('demoMsg');
    if (demoMsg) {
        demoMsg.textContent = 'Demo: Admin (ID: admin, Password: admin123) | New Admin: thatipamulajyothishwargoud@gmail.com / Bhanu@9002 | Employee (use any EMP ID, Password: emp@XXX)';
    }

    // Remove old listener by cloning
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);

    const tryLocalFallback = function(empId, password, role, btn) {
        // Built-in admin credential check for offline mode
        if (role === 'admin') {
            const isOldAdmin = (empId === 'admin' || empId === 'admin@company.com') && password === 'admin123';
            const isNewAdmin = (empId === 'thatipamulajyothishwargoud@gmail.com' || empId === 'thatipamulajyothishwargoud') && password === 'Bhanu@9002';
            if (isOldAdmin || isNewAdmin) {
                const adminId = isNewAdmin ? 'thatipamulajyothishwargoud@gmail.com' : 'admin';
                const adminName = isNewAdmin ? 'Jyothishwar Goud Thatipamula' : 'Admin';
                showNotification('Login successful! Welcome ' + adminName, 'success');
                localStorage.setItem('loggedInUser', JSON.stringify({ id: adminId, name: adminName, role: 'admin' }));
                setTimeout(() => { window.location.href = 'dashboard.html'; }, 800);
                return true;
            }
        } else {
            // Employee fallback
            if (typeof CompanyData !== 'undefined' && CompanyData.employees) {
                const employee = CompanyData.employees.find(e => e.id === empId || e.email === empId);
                if (employee && password === employee.password) {
                    showNotification('Login successful! Welcome ' + employee.name, 'success');
                    localStorage.setItem('loggedInUser', JSON.stringify({ id: employee.id, name: employee.name, role: 'employee', department: employee.department }));
                    setTimeout(() => { window.location.href = 'dashboard.html'; }, 800);
                    return true;
                }
            }
        }
        return false;
    };

    newForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const empId = document.getElementById('empId')?.value.trim();
        const password = document.getElementById('password')?.value;
        const role = document.getElementById('role')?.value;

        if (!empId || !password || !role) {
            showNotification('Please fill all fields', 'error');
            return;
        }

        const btn = newForm.querySelector('.btn');
        if (btn) { btn.disabled = true; btn.textContent = 'Logging in...'; }

        try {
            const result = await AuthAPI.login(empId, password, role);
            setToken(result.token);
            setStoredUser(result.user);
            localStorage.setItem('loggedInUser', JSON.stringify(result.user));

            showNotification(result.message, 'success');

            if (result.user.role === 'employee' && result.user.isFirstLogin) {
                setTimeout(() => { window.location.href = 'employee-details.html'; }, 800);
            } else {
                setTimeout(() => { window.location.href = 'dashboard.html'; }, 800);
            }
        } catch (err) {
            // If API is unreachable, try local credential fallback
            const isServerError = err.message && (err.message.includes('Cannot connect to server') || err.message.includes('Failed to fetch'));
            if (isServerError) {
                console.warn('Backend server unavailable. Trying local fallback...');
                const fallbackSuccess = tryLocalFallback(empId, password, role, btn);
                if (fallbackSuccess) return;
                showNotification('Backend server unavailable. Login failed.', 'error');
            } else {
                showNotification(err.message || 'Login failed', 'error');
            }
            if (btn) { btn.disabled = false; btn.textContent = 'Login'; }
        }
    });
};

// Override forgotPassword to use API
window.forgotPassword = async function() {
    const empId = document.getElementById('empId')?.value.trim();
    if (!empId) {
        showNotification('Please enter your Employee ID or Email first', 'error');
        return;
    }

    try {
        const result = await AuthAPI.forgotPassword(empId);

        const demoMsg = document.getElementById('demoMsg');
        if (demoMsg) {
            const otp = result.otp || '******';
            demoMsg.innerHTML = 'Verification code sent to <strong>' + empId + '</strong><br>'
                + (result.otp ? 'Your code: <strong style="font-size:20px;letter-spacing:4px;">' + otp + '</strong><br>'
                   + '<small>(Development mode - code shown)</small><br><br>'
                   : '<small>(Check your email for the OTP)</small><br><br>')
                + '<div class="form-group"><label>Enter Code</label>'
                + '<input type="text" id="verifyCode" placeholder="Enter 6-digit code" '
                + 'style="width:100%;padding:10px;border:1px solid var(--grey-300);border-radius:var(--radius-sm);text-align:center;font-size:18px;letter-spacing:6px;"></div>'
                + '<div class="form-group"><label>New Password</label>'
                + '<input type="password" id="resetNewPwd" placeholder="New password (min 4 chars)" '
                + 'style="width:100%;padding:10px;border:1px solid var(--grey-300);border-radius:var(--radius-sm);"></div>'
                + '<button class="btn btn-primary btn-sm" onclick="completeForgotPassword()" '
                + 'style="width:100%;">Verify & Reset</button>';
        }
        showNotification('Verification code sent', 'info');
    } catch (err) {
        showNotification(err.message || 'Failed to send verification code', 'error');
    }
};

// New function for complete forgot password flow
window.completeForgotPassword = async function() {
    const empId = document.getElementById('empId')?.value.trim();
    const otp = document.getElementById('verifyCode')?.value.trim();
    const newPwd = document.getElementById('resetNewPwd')?.value;

    if (!otp || !newPwd) {
        showNotification('Please fill all fields', 'error');
        return;
    }
    if (newPwd.length < 4) {
        showNotification('Password must be at least 4 characters', 'error');
        return;
    }

    try {
        await AuthAPI.verifyOTP(empId, otp);
        await AuthAPI.resetPassword(empId, newPwd);

        const demoMsg = document.getElementById('demoMsg');
        if (demoMsg) {
            demoMsg.innerHTML = 'Password reset successful!<br>'
                + 'You can now login with your new password.<br><br>'
                + '<button class="btn btn-primary btn-sm" onclick="window.location.href=\'login.html\'" '
                + 'style="width:100%;">Go to Login</button>';
        }
        showNotification('Password reset successful!', 'success');
    } catch (err) {
        showNotification(err.message || 'Failed to reset password', 'error');
    }
};

// Override showPasswordSetup for first-time setup
window.showPasswordSetup = function() {
    const demoMsg = document.getElementById('demoMsg');
    if (!demoMsg) return;
    demoMsg.innerHTML = '<strong>First Time Password Setup</strong><br><br>'
        + '<div class="form-group"><label>Employee ID or Email</label>'
        + '<input type="text" id="setupEmpId" placeholder="Enter your Employee ID or Email" '
        + 'style="width:100%;padding:10px;border:1px solid var(--grey-300);border-radius:var(--radius-sm);"></div>'
        + '<button class="btn btn-primary btn-sm" onclick="sendSetupCode()" style="width:100%;">Send Verification Code</button>';
};

// Override sendSetupCode to use API
window.sendSetupCode = async function() {
    const input = document.getElementById('setupEmpId')?.value.trim();
    if (!input) {
        showNotification('Please enter your Employee ID or Email', 'error');
        return;
    }

    try {
        const result = await AuthAPI.forgotPassword(input);

        const demoMsg = document.getElementById('demoMsg');
        if (demoMsg) {
            const otp = result.otp || '******';
            demoMsg.innerHTML = 'Verification code sent to <strong>' + input + '</strong><br>'
                + (result.otp ? 'Your code: <strong style="font-size:20px;letter-spacing:4px;">' + otp + '</strong><br>'
                   + '<small>(Development mode - code shown)</small><br><br>'
                   : '<small>(Check your email for the OTP)</small><br><br>')
                + '<div class="form-group"><label>Enter Code</label>'
                + '<input type="text" id="setupVerifyCode" placeholder="Enter 6-digit code" '
                + 'style="width:100%;padding:10px;border:1px solid var(--grey-300);border-radius:var(--radius-sm);text-align:center;font-size:18px;letter-spacing:6px;"></div>'
                + '<div class="form-group"><label>New Password</label>'
                + '<input type="password" id="setupNewPwd" placeholder="Create a password (min 4 chars)" '
                + 'style="width:100%;padding:10px;border:1px solid var(--grey-300);border-radius:var(--radius-sm);"></div>'
                + '<div class="form-group"><label>Confirm Password</label>'
                + '<input type="password" id="setupConPwd" placeholder="Confirm your password" '
                + 'style="width:100%;padding:10px;border:1px solid var(--grey-300);border-radius:var(--radius-sm);"></div>'
                + '<button class="btn btn-primary btn-sm" onclick="completePasswordSetup()" '
                + 'style="width:100%;">Set Password</button>';
        }
        showNotification('Verification code sent', 'info');
    } catch (err) {
        showNotification(err.message || 'Failed to send code', 'error');
    }
};

// Override completePasswordSetup to use API
window.completePasswordSetup = async function() {
    const input = document.getElementById('setupEmpId')?.value.trim();
    const entered = document.getElementById('setupVerifyCode')?.value.trim();
    const newPwd = document.getElementById('setupNewPwd')?.value;
    const conPwd = document.getElementById('setupConPwd')?.value;

    if (!entered) { showNotification('Please enter the verification code', 'error'); return; }
    if (!newPwd || newPwd.length < 4) { showNotification('Password must be at least 4 characters', 'error'); return; }
    if (newPwd !== conPwd) { showNotification('Passwords do not match', 'error'); return; }

    try {
        await AuthAPI.firstTimeSetup(input, entered, newPwd);

        const demoMsg = document.getElementById('demoMsg');
        if (demoMsg) {
            demoMsg.innerHTML = 'Password set successfully!<br>You can now login with your new password.<br><br>'
                + '<button class="btn btn-primary btn-sm" onclick="window.location.href=\'login.html\'" '
                + 'style="width:100%;">Go to Login</button>';
        }
        showNotification('Password created successfully! You can now login.', 'success');
    } catch (err) {
        showNotification(err.message || 'Setup failed', 'error');
    }
};

// Override saveNewPassword to use API
window.saveNewPassword = async function() {
    const curPwd = document.getElementById('curPwd')?.value;
    const newPwd = document.getElementById('newPwd')?.value;
    const conPwd = document.getElementById('conPwd')?.value;

    if (!curPwd || !newPwd || !conPwd) {
        showNotification('Please fill all password fields', 'error');
        return;
    }
    if (newPwd !== conPwd) { showNotification('New passwords do not match', 'error'); return; }
    if (newPwd.length < 4) { showNotification('Password must be at least 4 characters', 'error'); return; }

    try {
        await AuthAPI.changePassword(curPwd, newPwd);
        showNotification('Password updated successfully!', 'success');
        hideChangePassword();
    } catch (err) {
        showNotification(err.message || 'Failed to update password', 'error');
    }
};

// Override logout
window.logout = function() {
    clearToken();
    clearStoredUser();
    localStorage.removeItem('loggedInUser');
    showNotification('Logged out successfully', 'info');
    setTimeout(() => { window.location.href = 'login.html'; }, 500);
};

// ====== OVERRIDE: loadSavedData to fetch from API ======

const originalLoadSavedData = window.loadSavedData;
window.loadSavedData = async function() {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    if (page === 'login.html' || page === 'index.html') return;

    const token = getToken();
    if (!token) return;

    try {
        // Fetch employees
        const employees = await EmployeesAPI.getAll();
        if (Array.isArray(employees) && employees.length > 0) {
            // Map API fields to frontend field names
            CompanyData.employees = employees.map(e => ({
                id: e.id,
                name: e.name,
                email: e.email,
                password: '',
                phone: e.phone || '',
                department: e.department || '',
                designation: e.designation || '',
                joiningDate: e.joining_date || '',
                bloodGroup: e.blood_group || 'O+',
                address: e.address || '',
                project: e.project || 'Not assigned',
                reportingManager: e.reporting_manager || 'TBD',
                status: e.status || 'Active',
                progress: e.progress || 0,
                attendance: e.attendance || 0,
                tasksCompleted: e.tasks_completed || 0,
                tasksPending: e.tasks_pending || 0,
                performance: e.performance || 0,
                workHours: e.work_hours || 0,
                checkIn: e.check_in || '--:--',
                checkOut: e.check_out || '--:--',
                image: e.image || null
            }));
            updateDashboardStats();
        }

        // Fetch reports
        try {
            const reports = await ReportsAPI.getAll();
            if (Array.isArray(reports) && reports.length > 0) {
                CompanyData.reports = reports.map(r => ({
                    id: r.id,
                    employeeId: r.employee_id,
                    employeeName: r.employee_name || '',
                    project: r.project || '',
                    date: r.date || '',
                    tasksCompleted: r.tasks_completed || 0,
                    tasksPending: r.tasks_pending || 0,
                    workingHours: r.working_hours || 0,
                    progress: r.progress || 0,
                    managerComments: r.manager_comments || '',
                    status: r.status || 'Submitted'
                }));
            }
        } catch (e) {
            // Reports might not be ready, use defaults
        }

        // Fetch attendance
        try {
            const attendance = await AttendanceAPI.getAll();
            if (Array.isArray(attendance) && attendance.length > 0) {
                CompanyData.attendance = attendance.map(a => ({
                    employeeId: a.employee_id,
                    date: a.date || '',
                    checkIn: a.check_in || '--:--',
                    checkOut: a.check_out || '--:--',
                    hours: a.hours || 0,
                    status: a.status || 'Present'
                }));
            }
        } catch (e) {}

        // Fetch projects
        try {
            const projects = await ProjectsAPI.getAll();
            if (Array.isArray(projects) && projects.length > 0) {
                CompanyData.projects = projects.map(p => ({
                    id: p.id,
                    name: p.name,
                    manager: p.manager || 'Admin',
                    team: p.team_ids ? p.team_ids.split(',') : [],
                    startDate: p.start_date || '',
                    deadline: p.deadline || '',
                    status: p.status || 'Not Started',
                    priority: p.priority || 'Medium',
                    completion: p.completion || 0
                }));
            }
        } catch (e) {}

        // Refresh page-specific data if already initialized
        if (typeof initEmployeeDetails === 'function' && page === 'employee-details.html') {
            initEmployeeDetails();
        }
    } catch (err) {
        console.error('Failed to load data:', err);
        // Fallback to localStorage data
        if (typeof originalLoadSavedData === 'function') {
            originalLoadSavedData();
        }
    }
};

// ====== OVERRIDE: Employee CRUD ======

const originalOpenAddEmployeeModal = window.openAddEmployeeModal;
window.openAddEmployeeModal = function() {
    const modal = document.getElementById('addEmployeeModal');
    const form = document.getElementById('addEmployeeForm');
    if (!modal || !form) return;
    modal.classList.add('active');

    const titleEl = modal.querySelector('.modal-header h3');
    const submitBtn = form.querySelector('.btn-primary');
    if (titleEl) titleEl.textContent = 'Add Employee';
    if (submitBtn) submitBtn.textContent = 'Save Employee';

    clearPhotoPreview();
    form.reset();

    form.onsubmit = async function(e) {
        e.preventDefault();
        const formData = new FormData(form);
        const photoPreview = document.getElementById('photoPreview');
        if (photoPreview && photoPreview.getAttribute('data-photo')) {
            // Convert base64 to blob
            const dataUrl = photoPreview.getAttribute('data-photo');
            const blob = dataURLToBlob(dataUrl);
            formData.append('photo', blob, 'photo.jpg');
        }

        const btn = form.querySelector('.btn-primary');
        if (btn) { btn.disabled = true; btn.textContent = 'Saving...'; }

        try {
            await EmployeesAPI.create(formData);
            showNotification('Employee created successfully!', 'success');
            modal.classList.remove('active');
            // Reload data
            await window.loadSavedData();
            if (typeof loadEmployeeTable === 'function') loadEmployeeTable();
        } catch (err) {
            showNotification(err.message || 'Failed to create employee', 'error');
        }
        if (btn) { btn.disabled = false; btn.textContent = 'Save Employee'; }
    };
};

// Helper: convert data URL to Blob
function dataURLToBlob(dataUrl) {
    const parts = dataUrl.split(',');
    const mime = parts[0].match(/:(.*?);/)[1];
    const bytes = atob(parts[1]);
    const arr = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
    return new Blob([arr], { type: mime });
}

const originalEditEmployee = window.editEmployee;
window.editEmployee = function(id) {
    const emp = CompanyData.employees.find(e => e.id === id);
    if (!emp) { showNotification('Employee not found', 'error'); return; }

    const modal = document.getElementById('addEmployeeModal');
    const form = document.getElementById('addEmployeeForm');
    if (!modal || !form) return;

    form.querySelector('[name="name"]').value = emp.name || '';
    form.querySelector('[name="email"]').value = emp.email || '';
    form.querySelector('[name="phone"]').value = emp.phone || '';
    form.querySelector('[name="department"]').value = emp.department || '';
    form.querySelector('[name="designation"]').value = emp.designation || '';
    form.querySelector('[name="joiningDate"]').value = emp.joiningDate || '';
    form.querySelector('[name="bloodGroup"]').value = emp.bloodGroup || 'O+';
    form.querySelector('[name="address"]').value = emp.address || '';
    form.querySelector('[name="project"]').value = emp.project || 'Not assigned';
    form.querySelector('[name="manager"]').value = emp.reportingManager || 'TBD';

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

    // Remove old listener
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);

    newForm.onsubmit = async function(e) {
        e.preventDefault();
        const formData = new FormData(newForm);
        const photoPreview = document.getElementById('photoPreview');
        if (photoPreview && photoPreview.getAttribute('data-photo') && !photoPreview.getAttribute('data-photo').includes('http')) {
            const dataUrl = photoPreview.getAttribute('data-photo');
            const blob = dataURLToBlob(dataUrl);
            formData.append('photo', blob, 'photo.jpg');
        }

        const btn = newForm.querySelector('.btn-primary');
        if (btn) { btn.disabled = true; btn.textContent = 'Updating...'; }

        try {
            await EmployeesAPI.update(id, formData);
            showNotification('Employee updated successfully!', 'success');
            modal.classList.remove('active');
            await window.loadSavedData();
            if (typeof loadEmployeeTable === 'function') {
                currentPage = 1;
                loadEmployeeTable();
            }
        } catch (err) {
            showNotification(err.message || 'Failed to update employee', 'error');
        }
        if (btn) { btn.disabled = false; btn.textContent = 'Save Employee'; }
    };

    modal.classList.add('active');
};

const originalDeleteEmployee = window.deleteEmployee;
window.deleteEmployee = function(id) {
    const modal = document.getElementById('confirmModal');
    if (!modal) return;
    modal.classList.add('active');

    const yesBtn = modal.querySelector('.confirm-yes');
    const noBtn = modal.querySelector('.confirm-no');

    // Clone to remove old listeners
    const newYesBtn = yesBtn.cloneNode(true);
    const newNoBtn = noBtn.cloneNode(true);
    if (yesBtn.parentNode) {
        yesBtn.parentNode.replaceChild(newYesBtn, yesBtn);
        noBtn.parentNode.replaceChild(newNoBtn, noBtn);
    }

    newYesBtn.addEventListener('click', async function() {
        try {
            await EmployeesAPI.delete(id);
            showNotification('Employee deleted successfully', 'success');
            modal.classList.remove('active');
            await window.loadSavedData();
            if (typeof loadEmployeeTable === 'function') {
                currentPage = 1;
                loadEmployeeTable();
            }
        } catch (err) {
            showNotification(err.message || 'Failed to delete employee', 'error');
            modal.classList.remove('active');
        }
    });

    newNoBtn.addEventListener('click', function() {
        modal.classList.remove('active');
    });
};

// ====== OVERRIDE: Reports ======

const originalApproveReport = window.approveReport;
window.approveReport = async function(id) {
    try {
        await ReportsAPI.updateStatus(id, 'Approved', 'Approved by admin');
        showNotification('Report ' + id + ' approved successfully!', 'success');
        await window.loadSavedData();
        if (typeof loadReportsTable === 'function') loadReportsTable();
    } catch (err) {
        showNotification(err.message || 'Failed to approve report', 'error');
    }
};

const originalRejectReport = window.rejectReport;
window.rejectReport = async function(id) {
    try {
        await ReportsAPI.updateStatus(id, 'Rejected', 'Rejected by admin');
        showNotification('Report ' + id + ' has been rejected', 'warning');
        await window.loadSavedData();
        if (typeof loadReportsTable === 'function') loadReportsTable();
    } catch (err) {
        showNotification(err.message || 'Failed to reject report', 'error');
    }
};

const originalSubmitReport = window.submitEmployeeReport;
window.submitEmployeeReport = async function(event) {
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

    try {
        await ReportsAPI.create({
            employeeId: empId,
            employeeName: empName,
            project: project,
            reportDate: date,
            workDone: workDone,
            pendingWork: form.querySelector('[name="pendingWork"]')?.value || '',
            blockers: form.querySelector('[name="blockers"]')?.value || '',
            tasksCompleted: parseInt(form.querySelector('[name="tasksCompleted"]')?.value) || 0,
            tasksPending: parseInt(form.querySelector('[name="tasksPending"]')?.value) || 0,
            workingHours: parseFloat(workingHours),
            progress: parseInt(progress),
            tomorrowPlan: form.querySelector('[name="tomorrowPlan"]')?.value || ''
        });

        showNotification('Report submitted successfully!', 'success');
        form.reset();
        await window.loadSavedData();
        if (typeof loadReportsTable === 'function') loadReportsTable();
    } catch (err) {
        showNotification(err.message || 'Failed to submit report', 'error');
    }
    return false;
};

// ====== OVERRIDE: Dashboard to use API ======

const originalInitDashboard = window.initDashboard;
window.initDashboard = async function() {
    try {
        const stats = await DashboardAPI.getStats();
        const user = getStoredUser();

        if (user && user.role === 'employee') {
            // Employee dashboard - show personal info
            const cards = document.querySelectorAll('.summary-card');
            if (cards.length >= 4) {
                cards[0].querySelector('.card-label').textContent = 'My Name';
                cards[0].querySelector('.card-value').textContent = stats.name || user.name;
                cards[1].querySelector('.card-label').textContent = 'Department';
                cards[1].querySelector('.card-value').textContent = stats.department || user.department || 'N/A';
                cards[2].querySelector('.card-label').textContent = 'Designation';
                cards[2].querySelector('.card-value').textContent = stats.designation || 'N/A';
                cards[3].querySelector('.card-label').textContent = 'Attendance';
                cards[3].querySelector('.card-value').textContent = (stats.attendance || 0) + '%';
                if (cards.length >= 8) {
                    cards[4].querySelector('.card-label').textContent = 'Progress';
                    cards[4].querySelector('.card-value').textContent = (stats.progress || 0) + '%';
                    cards[5].querySelector('.card-label').textContent = 'Performance';
                    cards[5].querySelector('.card-value').textContent = (stats.performance || 0) + '/5';
                    cards[6].querySelector('.card-label').textContent = 'Projects';
                    cards[6].querySelector('.card-value').textContent = stats.projectCount || 0;
                    cards[7].querySelector('.card-label').textContent = 'Work Hours';
                    cards[7].querySelector('.card-value').textContent = (stats.workHours || 0) + 'h';
                }
            }
            const h2 = document.querySelector('.page-header h2');
            const breadcrumb = document.querySelector('.breadcrumb');
            if (h2) h2.textContent = 'My Dashboard';
            if (breadcrumb) breadcrumb.textContent = 'Home / My Dashboard';
        } else {
            // Admin dashboard - animate counters
            const statMap = {
                totalEmployees: stats.totalEmployees || 0,
                activeEmployees: stats.activeEmployees || 0,
                onLeave: stats.onLeave || 0,
                totalDepartments: stats.totalDepartments || 0,
                ongoingProjects: stats.ongoingProjects || 0,
                completedProjects: stats.completedProjects || 0,
                pendingReports: stats.pendingReports || 0,
                averageProgress: (stats.averageProgress || 0) + '%'
            };
            Object.entries(statMap).forEach(([id, val]) => {
                const el = document.getElementById(id);
                if (el && typeof val === 'number') {
                    animateCounter(id, val);
                } else if (el) {
                    el.textContent = val;
                }
            });

            // Load charts
            if (typeof initDashboardCharts === 'function') {
                initDashboardCharts();
            }
        }
    } catch (err) {
        console.error('Dashboard API error:', err);
        // Fall back to original behavior
        if (typeof originalInitDashboard === 'function') {
            originalInitDashboard();
        }
    }
};

// ====== OVERRIDE: Analysis to use API ======

const originalInitAnalysis = window.initAnalysis;
window.initAnalysis = async function() {
    try {
        const charts = await DashboardAPI.getCharts();
        const topPerformers = await DashboardAPI.getTopPerformers();
        const deptOverview = await DashboardAPI.getDepartmentOverview();

        // Summary
        const totalEmployees = CompanyData.employees.length;
        const avgPerf = totalEmployees ? CompanyData.employees.reduce((s, e) => s + e.performance, 0) / totalEmployees : 0;
        const avgProg = totalEmployees ? Math.round(CompanyData.employees.reduce((s, e) => s + e.progress, 0) / totalEmployees) : 0;
        const avgAtt = totalEmployees ? Math.round(CompanyData.employees.reduce((s, e) => s + e.attendance, 0) / totalEmployees) : 0;

        const el = (id) => document.getElementById(id);
        el('anlAvgPerformance') && (el('anlAvgPerformance').textContent = avgPerf.toFixed(1));
        el('anlAvgProgress') && (el('anlAvgProgress').textContent = avgProg + '%');
        el('anlAvgAttendance') && (el('anlAvgAttendance').textContent = avgAtt + '%');
        el('anlTotalReports') && (el('anlTotalReports').textContent = (CompanyData.reports || []).length);
        el('anlNeedsImprovement') && (el('anlNeedsImprovement').textContent = CompanyData.employees.filter(e => e.progress <= 30).length);
        el('anlTopPerformers') && (el('anlTopPerformers').textContent = CompanyData.employees.filter(e => e.performance >= 4.5).length);

        // Charts using API data
        setTimeout(() => {
            createDeptPerfChartFromData(charts.deptPerformance || []);
            createDeptCountChartFromData(charts.deptPerformance || []);
            createPerfDistChartFromData(charts.perfDistribution || {});
            createProgressBracketChartFromData(charts.progressBrackets || {});
            createAttendanceSummaryChartFromData(charts.attendanceSummary || {});
            createReportStatusChartFromData(charts.reportStatus || []);
        }, 100);

        // Top performers & dept overview
        const topList = document.getElementById('topPerformersList');
        if (topList && topPerformers.length > 0) {
            topList.innerHTML = topPerformers.map((emp, i) =>
                `<div class="detail-row">
                    <span class="label">${i + 1}. ${emp.name}</span>
                    <span class="value" style="color:var(--warning);">${'★'.repeat(Math.floor(emp.performance))}${'☆'.repeat(5 - Math.floor(emp.performance))}</span>
                </div>`
            ).join('');
        }

        const deptList = document.getElementById('deptOverviewList');
        if (deptList && deptOverview.length > 0) {
            deptList.innerHTML = deptOverview.map(d =>
                `<div class="detail-row">
                    <span class="label">${d.department} (${d.count})</span>
                    <span class="value" style="font-size:12px;">Perf: ${parseFloat(d.avg_performance).toFixed(1)} | Prog: ${Math.round(d.avg_progress)}%</span>
                </div>`
            ).join('');
        }

        // Load analysis table
        if (typeof loadAnalysisTable === 'function') loadAnalysisTable();
        if (typeof setupAnalysisFilters === 'function') setupAnalysisFilters();
    } catch (err) {
        console.error('Analysis API error:', err);
        if (typeof originalInitAnalysis === 'function') originalInitAnalysis();
    }
};

// Chart creator helpers with API data
function createDeptPerfChartFromData(data) {
    const ctx = document.getElementById('deptPerfChart');
    if (!ctx || !data.length) { if (typeof createDeptPerfChart === 'function') createDeptPerfChart(); return; }
    const labels = data.map(d => d.department);
    const values = data.map(d => parseFloat(d.avg_performance));
    new Chart(ctx, {
        type: 'bar', data: {
            labels, datasets: [{
                label: 'Avg Performance (out of 5)', data: values,
                backgroundColor: ['#1976d2','#28a745','#ff9800','#dc3545','#7b1fa2','#00796b','#e91e63','#ffc107','#00acc1','#6c757d'],
                borderRadius: 4
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, max: 5, grid: { color: 'rgba(0,0,0,0.05)' } }, x: { grid: { display: false }, ticks: { font: { size: 10 } } } } }
    });
}

function createDeptCountChartFromData(data) {
    const ctx = document.getElementById('deptCountChart');
    if (!ctx || !data.length) { if (typeof createDeptCountChart === 'function') createDeptCountChart(); return; }
    const labels = data.map(d => d.department);
    const values = data.map(d => parseInt(d.count));
    new Chart(ctx, {
        type: 'bar', data: {
            labels, datasets: [{
                label: 'Employees', data: values,
                backgroundColor: '#1976d2', borderRadius: 4
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } }, x: { grid: { display: false }, ticks: { font: { size: 10 } } } } }
    });
}

function createPerfDistChartFromData(data) {
    const ctx = document.getElementById('perfDistChart');
    if (!ctx) return;
    const dist = [
        data.needs_improvement || 0, data.below_average || 0,
        data.average || 0, data.good || 0, data.excellent || 0
    ];
    new Chart(ctx, {
        type: 'bar', data: {
            labels: ['< 1.5', '1.5 - 2.4', '2.5 - 3.4', '3.5 - 4.4', '4.5 - 5.0'],
            datasets: [{ label: 'Employees', data: dist,
                backgroundColor: ['#dc3545','#ff9800','#ffc107','#2196f3','#28a745'], borderRadius: 4 }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } }, x: { grid: { display: false } } } }
    });
}

function createProgressBracketChartFromData(data) {
    const ctx = document.getElementById('progressBracketChart');
    if (!ctx) return;
    const brackets = [
        data.needs_improvement || 0, data.average || 0,
        data.good || 0, data.excellent || 0
    ];
    new Chart(ctx, {
        type: 'doughnut', data: {
            labels: ['Needs Improvement (0-40%)', 'Average (41-60%)', 'Good (61-80%)', 'Excellent (81-100%)'],
            datasets: [{ data: brackets, backgroundColor: ['#dc3545','#ffc107','#ff9800','#28a745'], borderWidth: 0 }]
        },
        options: { responsive: true, maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { padding: 12, font: { size: 11 }, usePointStyle: true } } },
            cutout: '60%' }
    });
}

function createAttendanceSummaryChartFromData(data) {
    const ctx = document.getElementById('attendanceSummaryChart');
    if (!ctx) return;
    new Chart(ctx, {
        type: 'pie', data: {
            labels: ['Present', 'Absent', 'Late', 'On Leave'],
            datasets: [{ data: [data.present || 0, data.absent || 0, data.late || 0, data.on_leave || 0],
                backgroundColor: ['#28a745','#dc3545','#ff9800','#ffc107'], borderWidth: 0 }]
        },
        options: { responsive: true, maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { padding: 12, font: { size: 11 }, usePointStyle: true } } } }
    });
}

function createReportStatusChartFromData(data) {
    const ctx = document.getElementById('reportStatusChart');
    if (!ctx || !data.length) { if (typeof createReportStatusChart === 'function') createReportStatusChart(); return; }
    const labels = data.map(d => d.status);
    const values = data.map(d => parseInt(d.count));
    new Chart(ctx, {
        type: 'doughnut', data: {
            labels, datasets: [{ data: values,
                backgroundColor: ['#2196f3','#ffc107','#28a745','#dc3545'], borderWidth: 0 }]
        },
        options: { responsive: true, maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { padding: 12, font: { size: 11 }, usePointStyle: true } } },
            cutout: '60%' }
    });
}

// ====== OVERRIDE: Sidebar user info ======

const originalInitSidebar = window.initSidebar;
window.initSidebar = function() {
    if (typeof originalInitSidebar === 'function') originalInitSidebar();

    // Ensure user info is synced from new storage
    const user = getStoredUser();
    if (user) {
        const avatarEl = document.querySelector('.user-profile .user-avatar');
        const nameEl = document.querySelector('.user-profile .user-name');
        const roleEl = document.querySelector('.user-profile .user-role');
        if (avatarEl) avatarEl.textContent = (user.name || 'U').charAt(0).toUpperCase();
        if (nameEl) nameEl.textContent = user.name || 'User';
        if (roleEl) roleEl.textContent = user.role === 'admin' ? 'Administrator' : 'Employee';
    }
};

// ====== OVERRIDE: initPageSpecific to await async init ======

const originalInitPageSpecific = window.initPageSpecific;
window.initPageSpecific = function() {
    const page = window.location.pathname.split('/').pop() || 'index.html';

    // Override the async inits after loadSavedData completes
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(async () => {
            if (page === 'dashboard.html' && typeof window.initDashboard === 'function') {
                // Called by original flow, but our override is async
            }
            if (page === 'analysis.html' && typeof window.initAnalysis === 'function') {
                // Our override handles it
            }
            if (page === 'employees.html' && typeof loadEmployeeTable === 'function') {
                loadEmployeeTable();
                if (typeof setupEmployeeFilters === 'function') setupEmployeeFilters();
                if (typeof setupEmployeeModals === 'function') setupEmployeeModals();
                if (typeof setupAddEmployee === 'function') setupAddEmployee();
            }
        }, 500);
    });
};

// ====== FIX: initPageSpecific to handle async ======

// Override the DOMContentLoaded flow
const originalDOMReady = document.addEventListener;
document.addEventListener('DOMContentLoaded', function() {}, { once: true });

// Patch loadSavedData call to be async
const originalDOMContentLoaded = document.addEventListener;

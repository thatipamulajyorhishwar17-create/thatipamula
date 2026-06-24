// API Configuration
const API_BASE_URL = window.location.origin + '/api';

// Token Management
const TOKEN_KEY = 'ps_token';
const USER_KEY = 'ps_user';

function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

function setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
}

function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
}

function getStoredUser() {
    try {
        return JSON.parse(localStorage.getItem(USER_KEY));
    } catch(e) { return null; }
}

function setStoredUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clearStoredUser() {
    localStorage.removeItem(USER_KEY);
}

// API Request Helper
async function apiRequest(endpoint, options = {}) {
    const token = getToken();
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers || {})
        },
        ...options
    };

    if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
        config.body = JSON.stringify(config.body);
    }

    if (config.body instanceof FormData) {
        delete config.headers['Content-Type'];
    }

    try {
        const response = await fetch(API_BASE_URL + endpoint, config);
        let data;
        let responseText;

        try {
            responseText = await response.text();
            if (!responseText || responseText.trim().length === 0) {
                throw new Error('empty_body');
            }
            data = JSON.parse(responseText);
        } catch (jsonErr) {
            if (jsonErr.message === 'empty_body') {
                throw new Error('Server returned empty response (status ' + response.status + ') for ' + endpoint + '. The server may have crashed or the route may not exist.');
            }
            throw new Error('Server returned: ' + (responseText || '(empty)') + ' (status ' + response.status + ') for ' + endpoint);
        }

        if (!response.ok) {
            if (response.status === 401) {
                clearToken();
                clearStoredUser();
                if (window.location.pathname !== '/login.html' && window.location.pathname !== '/') {
                    window.location.href = 'login.html';
                }
            }
            throw new Error(data.message || 'Request failed');
        }
        return data;
    } catch (err) {
        if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
            throw new Error('Cannot connect to server. Please ensure the backend is running.');
        }
        throw err;
    }
}

// Auth API
const AuthAPI = {
    login: (id, password, role) =>
        apiRequest('/auth/login', { method: 'POST', body: { id, password, role } }),

    forgotPassword: (email) =>
        apiRequest('/auth/forgot-password', { method: 'POST', body: { email } }),

    verifyOTP: (email, otp) =>
        apiRequest('/auth/verify-otp', { method: 'POST', body: { email, otp } }),

    resetPassword: (email, newPassword) =>
        apiRequest('/auth/reset-password', { method: 'POST', body: { email, newPassword } }),

    changePassword: (currentPassword, newPassword) =>
        apiRequest('/auth/change-password', { method: 'POST', body: { currentPassword, newPassword } }),

    firstTimeSetup: (email, otp, newPassword) =>
        apiRequest('/auth/first-time-setup', { method: 'POST', body: { email, otp, newPassword } })
};

// Employees API
const EmployeesAPI = {
    getAll: () => apiRequest('/employees'),
    get: (id) => apiRequest('/employees/' + id),
    create: (formData) =>
        apiRequest('/employees', { method: 'POST', body: formData }),
    update: (id, data) =>
        apiRequest('/employees/' + id, { method: 'PUT', body: data }),
    delete: (id) =>
        apiRequest('/employees/' + id, { method: 'DELETE' }),
    uploadPhoto: (id, formData) =>
        apiRequest('/employees/' + id + '/photo', { method: 'POST', body: formData }),
    getPhoto: (id) => apiRequest('/employees/' + id + '/photo')
};

// Attendance API
const AttendanceAPI = {
    getAll: (params) => {
        const q = params ? '?' + new URLSearchParams(params).toString() : '';
        return apiRequest('/attendance' + q);
    },
    getToday: () => apiRequest('/attendance/today'),
    getByEmployee: (employeeId) => apiRequest('/attendance/' + employeeId),
    checkIn: (employeeId) => apiRequest('/attendance/check-in', { method: 'POST', body: { employeeId } }),
    checkOut: (employeeId) => apiRequest('/attendance/check-out', { method: 'POST', body: { employeeId } })
};

// Projects API
const ProjectsAPI = {
    getAll: (employeeId) => {
        const q = employeeId ? '?employee_id=' + employeeId : '';
        return apiRequest('/projects' + q);
    },
    get: (id) => apiRequest('/projects/' + id),
    create: (data) => apiRequest('/projects', { method: 'POST', body: data }),
    update: (id, data) => apiRequest('/projects/' + id, { method: 'PUT', body: data }),
    delete: (id) => apiRequest('/projects/' + id, { method: 'DELETE' })
};

// Reports API
const ReportsAPI = {
    getAll: (params) => {
        const q = params ? '?' + new URLSearchParams(params).toString() : '';
        return apiRequest('/reports' + q);
    },
    get: (id) => apiRequest('/reports/' + id),
    create: (data) => apiRequest('/reports', { method: 'POST', body: data }),
    updateStatus: (id, status, managerComments) =>
        apiRequest('/reports/' + id + '/status', { method: 'PUT', body: { status, managerComments } }),
    delete: (id) => apiRequest('/reports/' + id, { method: 'DELETE' })
};

// Dashboard API
const DashboardAPI = {
    getStats: () => apiRequest('/dashboard/stats'),
    getCharts: () => apiRequest('/dashboard/charts'),
    getTopPerformers: () => apiRequest('/dashboard/top-performers'),
    getDepartmentOverview: () => apiRequest('/dashboard/department-overview')
};

// Notifications API
const NotificationsAPI = {
    getAll: () => apiRequest('/notifications'),
    markAsRead: (id) => apiRequest('/notifications/' + id + '/read', { method: 'PUT' }),
    markAllAsRead: () => apiRequest('/notifications/read-all', { method: 'PUT' })
};

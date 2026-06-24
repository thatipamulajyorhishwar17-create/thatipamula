const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const { generateEmployeeId } = require('../utils/email');

const getAllEmployees = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM employees ORDER BY created_at DESC');
        const employees = rows.map(e => ({
            ...e,
            password: undefined,
            image: e.image ? e.image.toString('base64') : null
        }));
        return res.json(employees);
    } catch (err) {
        console.error('Get employees error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

const getEmployee = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM employees WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Employee not found' });
        const emp = rows[0];
        emp.password = undefined;
        const [attendance] = await pool.query('SELECT * FROM attendance WHERE employee_id = ? ORDER BY date DESC LIMIT 30', [req.params.id]);
        const [reports] = await pool.query('SELECT * FROM reports WHERE employee_id = ? ORDER BY date DESC LIMIT 10', [req.params.id]);
        const [projects] = await pool.query(
            'SELECT p.* FROM projects p JOIN project_team pt ON p.id = pt.project_id WHERE pt.employee_id = ?',
            [req.params.id]
        );
        return res.json({ ...emp, attendance, reports, projects });
    } catch (err) {
        console.error('Get employee error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

const createEmployee = async (req, res) => {
    try {
        const { name, email, phone, department, designation, joiningDate, bloodGroup, address, project, reportingManager, password } = req.body;
        if (!name || !email || !phone || !department || !designation) {
            return res.status(400).json({ message: 'Required fields missing' });
        }
        const id = await generateEmployeeId(pool);
        const empPassword = password || email.split('@')[0];
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(empPassword, salt);
        let image = null;
        if (req.file) {
            const fs = require('fs');
            image = fs.readFileSync(req.file.path);
        }
        await pool.query(
            `INSERT INTO employees (id, name, email, password, phone, department, designation, joining_date, blood_group, address, project, reporting_manager, image)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, name, email, hashedPassword, phone, department, designation, joiningDate || null, bloodGroup || 'O+', address || '', project || 'Not assigned', reportingManager || 'TBD', image]
        );
        return res.status(201).json({ message: 'Employee created', id });
    } catch (err) {
        console.error('Create employee error:', err);
        if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'Email already exists' });
        return res.status(500).json({ message: 'Server error' });
    }
};

const updateEmployee = async (req, res) => {
    try {
        const { name, email, phone, department, designation, joiningDate, bloodGroup, address, project, reportingManager, status, password } = req.body;
        const [existing] = await pool.query('SELECT * FROM employees WHERE id = ?', [req.params.id]);
        if (existing.length === 0) return res.status(404).json({ message: 'Employee not found' });
        let updateFields = [];
        let updateValues = [];
        if (name !== undefined) { updateFields.push('name = ?'); updateValues.push(name); }
        if (email !== undefined) { updateFields.push('email = ?'); updateValues.push(email); }
        if (phone !== undefined) { updateFields.push('phone = ?'); updateValues.push(phone); }
        if (department !== undefined) { updateFields.push('department = ?'); updateValues.push(department); }
        if (designation !== undefined) { updateFields.push('designation = ?'); updateValues.push(designation); }
        if (joiningDate !== undefined) { updateFields.push('joining_date = ?'); updateValues.push(joiningDate); }
        if (bloodGroup !== undefined) { updateFields.push('blood_group = ?'); updateValues.push(bloodGroup); }
        if (address !== undefined) { updateFields.push('address = ?'); updateValues.push(address); }
        if (project !== undefined) { updateFields.push('project = ?'); updateValues.push(project); }
        if (reportingManager !== undefined) { updateFields.push('reporting_manager = ?'); updateValues.push(reportingManager); }
        if (status !== undefined) { updateFields.push('status = ?'); updateValues.push(status); }
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            updateFields.push('password = ?');
            updateValues.push(hashedPassword);
        }
        if (req.file) {
            const fs = require('fs');
            const image = fs.readFileSync(req.file.path);
            updateFields.push('image = ?');
            updateValues.push(image);
        }
        if (updateFields.length > 0) {
            updateValues.push(req.params.id);
            await pool.query(`UPDATE employees SET ${updateFields.join(', ')} WHERE id = ?`, updateValues);
        }
        return res.json({ message: 'Employee updated' });
    } catch (err) {
        console.error('Update employee error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

const deleteEmployee = async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM employees WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Employee not found' });
        return res.json({ message: 'Employee deleted' });
    } catch (err) {
        console.error('Delete employee error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

const uploadPhoto = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
        const fs = require('fs');
        const image = fs.readFileSync(req.file.path);
        await pool.query('UPDATE employees SET image = ? WHERE id = ?', [image, req.params.id]);
        return res.json({ message: 'Photo uploaded' });
    } catch (err) {
        console.error('Upload photo error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

const getEmployeePhoto = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT image FROM employees WHERE id = ?', [req.params.id]);
        if (rows.length === 0 || !rows[0].image) return res.status(404).json({ message: 'No photo found' });
        const img = rows[0].image;
        const base64 = Buffer.isBuffer(img) ? img.toString('base64') : img;
        return res.json({ image: `data:image/jpeg;base64,${base64}` });
    } catch (err) {
        console.error('Get photo error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getAllEmployees, getEmployee, createEmployee, updateEmployee, deleteEmployee, uploadPhoto, getEmployeePhoto };

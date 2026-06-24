const pool = require('../config/db');
const { generateProjectId } = require('../utils/email');

const getAllProjects = async (req, res) => {
    try {
        let query = `SELECT p.*, GROUP_CONCAT(pt.employee_id) as team_ids FROM projects p LEFT JOIN project_team pt ON p.id = pt.project_id`;
        let params = [];
        if (req.query.employee_id) {
            query += ' WHERE pt.employee_id = ?';
            params.push(req.query.employee_id);
        }
        query += ' GROUP BY p.id ORDER BY p.created_at DESC';
        const [rows] = await pool.query(query, params);
        return res.json(rows);
    } catch (err) {
        console.error('Get projects error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

const getProject = async (req, res) => {
    try {
        const [project] = await pool.query(
            'SELECT p.*, GROUP_CONCAT(pt.employee_id) as team_ids FROM projects p LEFT JOIN project_team pt ON p.id = pt.project_id WHERE p.id = ? GROUP BY p.id',
            [req.params.id]
        );
        if (project.length === 0) return res.status(404).json({ message: 'Project not found' });
        const [team] = await pool.query(
            'SELECT e.id, e.name, e.department, e.designation FROM project_team pt JOIN employees e ON pt.employee_id = e.id WHERE pt.project_id = ?',
            [req.params.id]
        );
        return res.json({ ...project[0], team });
    } catch (err) {
        console.error('Get project error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

const createProject = async (req, res) => {
    try {
        const { name, manager, startDate, deadline, status, priority, completion, team } = req.body;
        if (!name) return res.status(400).json({ message: 'Project name is required' });
        const id = await generateProjectId(pool);
        await pool.query(
            'INSERT INTO projects (id, name, manager, start_date, deadline, status, priority, completion) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [id, name, manager || 'Admin', startDate || null, deadline || null, status || 'Not Started', priority || 'Medium', completion || 0]
        );
        if (team && Array.isArray(team)) {
            for (const empId of team) {
                await pool.query('INSERT INTO project_team (project_id, employee_id) VALUES (?, ?)', [id, empId]);
            }
        }
        return res.status(201).json({ message: 'Project created', id });
    } catch (err) {
        console.error('Create project error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

const updateProject = async (req, res) => {
    try {
        const { name, manager, startDate, deadline, status, priority, completion, team } = req.body;
        const [existing] = await pool.query('SELECT * FROM projects WHERE id = ?', [req.params.id]);
        if (existing.length === 0) return res.status(404).json({ message: 'Project not found' });
        let fields = [], values = [];
        if (name !== undefined) { fields.push('name = ?'); values.push(name); }
        if (manager !== undefined) { fields.push('manager = ?'); values.push(manager); }
        if (startDate !== undefined) { fields.push('start_date = ?'); values.push(startDate); }
        if (deadline !== undefined) { fields.push('deadline = ?'); values.push(deadline); }
        if (status !== undefined) { fields.push('status = ?'); values.push(status); }
        if (priority !== undefined) { fields.push('priority = ?'); values.push(priority); }
        if (completion !== undefined) { fields.push('completion = ?'); values.push(completion); }
        if (fields.length > 0) {
            values.push(req.params.id);
            await pool.query(`UPDATE projects SET ${fields.join(', ')} WHERE id = ?`, values);
        }
        if (team && Array.isArray(team)) {
            await pool.query('DELETE FROM project_team WHERE project_id = ?', [req.params.id]);
            for (const empId of team) {
                await pool.query('INSERT INTO project_team (project_id, employee_id) VALUES (?, ?)', [req.params.id, empId]);
            }
        }
        return res.json({ message: 'Project updated' });
    } catch (err) {
        console.error('Update project error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

const deleteProject = async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM projects WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Project not found' });
        return res.json({ message: 'Project deleted' });
    } catch (err) {
        console.error('Delete project error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getAllProjects, getProject, createProject, updateProject, deleteProject };

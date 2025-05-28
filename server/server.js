require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

app.use(cors());
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
    res.send('Mentor API is running');
});

// Admin registration
app.post('/api/admin/signup', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query('INSERT INTO admins (username, password) VALUES (?, ?)', [username, hashedPassword]);
        res.status(201).json({ message: 'Admin user created successfully' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Username already exists' });
        }
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin login
app.post('/api/admin/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const [rows] = await db.query('SELECT * FROM admins WHERE username = ?', [username]);

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const admin = rows[0];
        const passwordMatch = await bcrypt.compare(password, admin.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Extended token expiry to 24 hours
        const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Token refresh endpoint
app.post('/api/admin/refresh', authenticateAdmin, (req, res) => {
    const { id, username } = req.user;
    const newToken = jwt.sign({ id, username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token: newToken });
});

// JWT middleware for admin authentication
function authenticateAdmin(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No token provided' });

    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
}

// Public: Get all mentors with optional filtering
app.get('/api/mentors', async (req, res, next) => {
    try {
        const { university, location, program, gender, religion } = req.query;

        let query = 'SELECT * FROM mentors WHERE 1=1';
        const params = [];

        if (university) {
            query += ' AND university LIKE ?';
            params.push(`%${university}%`);
        }
        if (location) {
            query += ' AND location LIKE ?';
            params.push(`%${location}%`);
        }
        if (program) {
            query += ' AND program LIKE ?';
            params.push(`%${program}%`);
        }
        if (gender) {
            query += ' AND gender = ?';
            params.push(gender);
        }
        if (religion) {
            query += ' AND religion = ?';
            params.push(religion);
        }

        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (error) {
        next(error);
    }
});

// Admin: Add a new mentor
app.post('/api/mentors', authenticateAdmin, async (req, res, next) => {
    const { name, email, university, program, graduation_year, location, gender, religion, bio, photo_url } = req.body;

    if (!name || !email) {
        return res.status(400).json({ message: 'Name and Email are required' });
    }

    try {
        await db.query(`
            INSERT INTO mentors (name, email, university, program, graduation_year, location, gender, religion, bio, photo_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
            [name, email, university, program, graduation_year, location, gender, religion, bio, photo_url]
        );
        res.status(201).json({ message: 'Mentor added successfully' });
    } catch (error) {
        next(error);
    }
});

// Admin: Edit an existing mentor
app.put('/api/mentors/:id', authenticateAdmin, async (req, res, next) => {
    const { id } = req.params;
    const { name, email, university, program, graduation_year, location, gender, religion, bio, photo_url } = req.body;

    try {
        const [result] = await db.query(`
            UPDATE mentors 
            SET name = ?, email = ?, university = ?, program = ?, graduation_year = ?, location = ?, gender = ?, religion = ?, bio = ?, photo_url = ?
            WHERE id = ?`,
            [name, email, university, program, graduation_year, location, gender, religion, bio, photo_url, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Mentor not found' });
        }

        res.json({ message: 'Mentor updated successfully' });
    } catch (error) {
        next(error);
    }
});

// Admin: Delete a mentor
app.delete('/api/mentors/:id', authenticateAdmin, async (req, res, next) => {
    const { id } = req.params;

    try {
        const [result] = await db.query('DELETE FROM mentors WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Mentor not found' });
        }

        res.json({ message: 'Mentor deleted successfully' });
    } catch (error) {
        next(error);
    }
});

// Centralized error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error', error: process.env.NODE_ENV === 'development' ? err.message : undefined });
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

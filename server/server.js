require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const db = require('./db');
const cloudinary = require('cloudinary').v2;

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    console.error('JWT_SECRET environment variable is required');
    process.exit(1);
}

// Configure nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Cloudinary setup
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(cors());
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
    res.send('Mentor API is running');
});

// Admin login (email + plain text password)
app.post('/api/admin/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const [rows] = await db.query('SELECT * FROM admins WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const admin = rows[0];

        // Plain text password check (temporary, no hashing)
        if (password !== admin.password) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: admin.id, email: admin.email }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Token refresh endpoint
app.post('/api/admin/refresh', authenticateAdmin, (req, res) => {
    const { id, email } = req.user;
    const newToken = jwt.sign({ id, email }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token: newToken });
});

// JWT middleware for admin authentication
function authenticateAdmin(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No token provided' });

    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = decoded;
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
    const { name, email, university, job_title, employer, area_professional_focus, area_sikhi_focus, undergraduate, post_graduate, graduation_year, location, favourite_kirtani, favourite_show, favourite_food, favourite_hobby, bio, photo_url } = req.body;

    if (!name || !email) {
        return res.status(400).json({ message: 'Name and Email are required' });
    }

    try {
        await db.query(`
            INSERT INTO mentors (name, email, university, job_title, employer, area_professional_focus, area_sikhi_focus, undergraduate, post_graduate, graduation_year, location, favourite_kirtani, favourite_show, favourite_food, favourite_hobby, bio, photo_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, email, university, job_title, employer, area_professional_focus, area_sikhi_focus, undergraduate, post_graduate, graduation_year, location, favourite_kirtani, favourite_show, favourite_food, favourite_hobby, bio, photo_url]
        );
        res.status(201).json({ message: 'Mentor added successfully' });
    } catch (error) {
        next(error);
    }
});

// Admin: Edit an existing mentor
app.put('/api/mentors/:id', authenticateAdmin, async (req, res, next) => {
    const { id } = req.params;
    const { name, email, university, job_title, employer, area_professional_focus, area_sikhi_focus, undergraduate, post_graduate, graduation_year, location, favourite_kirtani, favourite_show, favourite_food, favourite_hobby, bio, photo_url } = req.body;

    try {
        const [result] = await db.query(`
            UPDATE mentors 
            SET name = ?, email = ?, university = ?, job_title = ?, employer = ?, area_professional_focus = ?, area_sikhi_focus = ?, undergraduate = ?, post_graduate = ?, graduation_year = ?, location = ?, favourite_kirtani = ?, favourite_show = ?, favourite_food = ?, favourite_hobby = ?, bio = ?, photo_url = ?
            WHERE id = ?`,
            [name, email, university, job_title, employer, area_professional_focus, area_sikhi_focus, undergraduate, post_graduate, graduation_year, location, favourite_kirtani, favourite_show, favourite_food, favourite_hobby, bio, photo_url, id]
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

// Setup multer for memory storage (for Cloudinary uploads)
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
const upload = multer({ 
    storage,
    fileFilter,
    limits: {
        fileSize: 30 * 1024 * 1024 // 30MB limit
    }
});

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Upload endpoint (now uploads to Cloudinary)
app.post('/api/upload', authenticateAdmin, upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded or invalid file type' });
    }
    try {
        // Wrap Cloudinary upload_stream in a Promise
        const streamUpload = (fileBuffer) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                });
                stream.end(fileBuffer);
            });
        };
        const result = await streamUpload(req.file.buffer);
        res.json({ imageUrl: result.secure_url });
    } catch (error) {
        res.status(500).json({ message: 'Failed to upload image', error: error.message });
    }
});

// Contact mentor endpoint
app.post('/api/mentors/:id/contact', async (req, res) => {
    const { id } = req.params;
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ message: 'Name, email, and message are required' });
    }

    try {
        // Get mentor's email from database
        const [mentors] = await db.query('SELECT email, name FROM mentors WHERE id = ?', [id]);
        
        if (mentors.length === 0) {
            return res.status(404).json({ message: 'Mentor not found' });
        }

        const mentor = mentors[0];

        // Email content
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: mentor.email,
            subject: `New Mentoring Request from ${name}`,
            html: `
                <h2>New Mentoring Request</h2>
                <p><strong>From:</strong> ${name} (${email})</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
                <hr>
                <p><em>This message was sent through the Sikh Student Association platform.</em></p>
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);

        res.json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Failed to send email' });
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

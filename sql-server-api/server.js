const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken'); // Added JWT

const app = express();
const port = process.env.PORT || 3000;

// JWT secret key
const JWT_SECRET = 'your-secret-key'; // Should be stored in environment variables in production

// Set up MySQL connection
const db = mysql.createConnection({
    host: 'fyp.ch2yo0q2w1xc.ap-southeast-2.rds.amazonaws.com',
    user: 'admin',
    password: 'Iveisrubbish',
    database: 'fyp'
});

// Connect to the database
db.connect(err => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database.');
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Backend CORS settings
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Content-Type', 'application/json');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).json({});
    }
    next();
});

// Check for token in the request
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Authentication token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Registration API
app.post('/api/register', async (req, res) => {
    try {
        const { userName, firstName, lastName, email, phone, userPw } = req.body;

        // Check for required fields
        if (!userName || !firstName || !lastName || !email || !phone || !userPw) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Check if the username already exists
        const checkUser = 'SELECT * FROM user WHERE userName = ?';
        db.query(checkUser, [userName], async (error, results) => {
            if (error) {
                console.error('Database error:', error);
                return res.status(500).json({ message: 'Database error occurred.' });
            }

            if (results.length > 0) {
                return res.status(409).json({ message: 'Username already exists.' });
            }

            // Encrypt the password
            const hashedPassword = await bcrypt.hash(userPw, 10);

            // Insert new user
            const insertUser = 'INSERT INTO user (userName, firstName, lastName, email, phone, userPw) VALUES (?, ?, ?, ?, ?, ?)';
            db.query(insertUser, [userName, firstName, lastName, email, phone, hashedPassword], (error, results) => {
                if (error) {
                    console.error('Database error:', error);
                    return res.status(500).json({ message: 'Registration failed.' });
                }

                // Generate JWT token
                const token = jwt.sign(
                    { userId: results.insertId, userName: userName },
                    JWT_SECRET,
                    { expiresIn: '24h' }
                );

                res.status(201).json({
                    message: 'Registration successful',
                    token: token,
                    user: {
                        userName: userName,
                        firstName: firstName
                    }
                });
            });
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error occurred.' });
    }
});

// Login API
app.post('/api/login', async (req, res) => {
    try {
        console.log('Login request received:', req.body);
        const { userName, userPw } = req.body;

        const query = 'SELECT * FROM user WHERE userName = ?';
        db.query(query, [userName], async (error, results) => {
            if (error) {
                console.error('Database error:', error);
                return res.status(500).json({ message: 'Database error occurred.' });
            }

            console.log('Database results:', results);

            if (results.length === 0) {
                console.log('User not found');
                return res.status(401).json({ message: 'Invalid credentials.' });
            }

            const user = results[0];
            const validPassword = await bcrypt.compare(userPw, user.userPw);
            
            console.log('Password comparison:', {
                provided: userPw,
                stored: user.userPw,
                isValid: validPassword
            });

            if (!validPassword) {
                return res.status(401).json({ message: 'Invalid credentials.' });
            }

            // Generate JWT token
            const token = jwt.sign(
                { userId: user.id, userName: user.userName },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.status(200).json({
                message: 'Login successful',
                token: token,
                user: {
                    userId: user.userId,
                    userName: user.userName,
                    firstName: user.firstName
                }
            });
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error occurred.' });
    }
});

// Get user profile API (requires authentication)
app.get('/api/user/profile', authenticateToken, (req, res) => {
    const query = 'SELECT userName, firstName, lastName, email, phone FROM user WHERE userName = ?';
    db.query(query, [req.user.userName], (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ message: 'Database error occurred.' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({ user: results[0] });
    });
});

// Update user profile API (requires authentication)
app.put('/api/user/profile', authenticateToken, async (req, res) => {
    try {
        const { firstName, lastName, email, phone } = req.body;

        // Update user profile
        const query = 'UPDATE user SET firstName = ?, lastName = ?, email = ?, phone = ? WHERE userName = ?';
        db.query(query, [firstName, lastName, email, phone, req.user.userName], (error, results) => {
            if (error) {
                console.error('Database error:', error);
                return res.status(500).json({ message: 'Update failed.' });
            }

            res.status(200).json({ 
                message: 'Profile updated successfully',
                user: {
                    userName: req.user.userName,
                    firstName,
                    lastName,
                    email,
                    phone
                }
            });
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error occurred.' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    db.end();
    process.exit(0);
});

//createPlan
app.post('/api/createPlan', (req, res) => {
    const { name, type, level } = req.body;

    if (!name || !type || !level) {
        return res.status(400).json({ message: 'Name, type, and level are required.' });
    }

    const insertPlanQuery = 'INSERT INTO plans (name) VALUES (?)';
    db.query(insertPlanQuery, [name], (error, result) => {
        if (error) {
            console.error('Error inserting plan:', error);
            return res.status(500).json({ message: 'Failed to create plan.' });
        }

        const planId = result.insertId;

        const selectVideosQuery = 'SELECT id FROM videos WHERE type = ? AND level = ?';
        db.query(selectVideosQuery, [type, level], (error, videos) => {
            if (error) {
                console.error('Error querying videos:', error);
                return res.status(500).json({ message: 'Failed to fetch videos for plan.' });
            }

            if (videos.length === 0) {
                return res.status(404).json({ message: 'No videos found for the selected type and level.' });
            }

            const planVideos = videos.map(video => [planId, video.id]);
            const insertPlanVideosQuery = 'INSERT INTO plan_videos (plan_id, video_id) VALUES ?';
            db.query(insertPlanVideosQuery, [planVideos], (error) => {
                if (error) {
                    console.error('Error inserting plan videos:', error);
                    return res.status(500).json({ message: 'Failed to add videos to plan.' });
                }

                res.status(201).json({ message: 'Plan created successfully!', planId });
            });
        });
    });
});

//assignPlan
app.post('/api/assignPlan', (req, res) => {
    const { planId, userId } = req.body; 

    if (!planId || !userId) {
        return res.status(400).json({ message: 'Plan ID and User ID are required.' });
    }

    const insertUserPlanQuery = 'INSERT INTO user_plans (user_id, plan_id) VALUES (?, ?)';
    db.query(insertUserPlanQuery, [userId, planId], (error) => {
        if (error) {
            console.error('Error assigning plan to user:', error);
            return res.status(500).json({ message: 'Failed to assign plan to user.' });
        }

        res.status(201).json({ message: 'Plan assigned to user successfully!' });
    });
});

// Get user's plans
app.post('/api/user/plans', (req, res) => {
    const { userId } = req.body; 

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required.' });
    }

    const query = `
        SELECT p.id, p.name 
        FROM plans p
        INNER JOIN user_plans up ON p.id = up.plan_id
        WHERE up.user_id = ?
    `;
    
    db.query(query, [userId], (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ message: 'Failed to retrieve user plans.' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'No plans found for this user.' });
        }

        res.status(200).json(results); 
    });
});

app.post('/api/plan/videos', (req, res) => {
    const { planId } = req.body;

    if (!planId) {
        return res.status(400).json({ message: 'Plan ID is required' });
    }

    const query = `
        SELECT v.id, v.title, v.type, v.duration, v.description, v.url, v.thumbnail, v.level
        FROM videos v
        INNER JOIN plan_videos pv ON v.id = pv.video_id
        WHERE pv.plan_id = ?
    `;

    db.query(query, [planId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'No videos found for this plan' });
        }
        res.status(200).json(results);
    });
});

//Get all workous videos
app.get('/api/videos', (req, res) => {
    const limit = parseInt(req.query.limit) || 20; // 默认每页 20 条
    const offset = parseInt(req.query.offset) || 0; // 默认从第 0 条开始
    const type = req.query.type || null; // 可选查询参数

    let query = `SELECT id, title, type, duration, description, url, thumbnail, level FROM videos`;
    const params = [];

    if (type) {
        query += ` WHERE type = ?`;
        params.push(type);
    }

    query += ` LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    db.query(query, params, (error, results) => {
        if (error) {
            console.error('Database error:', error.message, error.stack);
            return res.status(500).json({ message: 'Database error occurred.' });
        }

        if (!results || results.length === 0) {
            return res.status(404).json({ message: 'No videos found.' });
        }

        res.status(200).json(results);
    });
});

// Click Like API
app.post('/api/videos/like', (req, res) => {
    const { userId, videoId } = req.body;

    if (!userId || !videoId) {
        return res.status(400).json({ message: 'userId and videoId are required.' });
    }

    const query = `INSERT INTO videoLikes (user_id, video_id) VALUES (?, ?)`;

    db.query(query, [userId, videoId], (error, results) => {
        if (error) {
            console.error('Database error:', error.message, error.stack);
            return res.status(500).json({ message: 'Database error occurred.' });
        }

        res.status(201).json({ message: 'Video liked successfully.' });
    });
});

// Cancel Like API
app.post('/api/videos/unlike', (req, res) => {
    const { userId, videoId } = req.body;

    if (!userId || !videoId) {
        return res.status(400).json({ message: 'userId and videoId are required.' });
    }

    const query = `DELETE FROM videoLikes WHERE user_id = ? AND video_id = ?`;

    db.query(query, [userId, videoId], (error, results) => {
        if (error) {
            console.error('Database error:', error.message, error.stack);
            return res.status(500).json({ message: 'Database error occurred.' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'No like record found to delete.' });
        }

        res.status(200).json({ message: 'Video unliked successfully.' });
    });
});


// Get the list of videos that user have been Liked
app.get('/api/videos/liked', (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ message: 'userId is required.' });
    }

    const query = `
        SELECT 
            videos.id,
            videos.title,
            videos.type,
            videos.duration,
            videos.description,
            videos.url,
            videos.thumbnail,
            videos.level
        FROM 
            videos
        INNER JOIN 
            videoLikes 
        ON 
            videos.id = videoLikes.video_id
        WHERE 
            videoLikes.user_id = ?
    `;

    db.query(query, [userId], (error, results) => {
        if (error) {
            console.error('Database error:', error.message, error.stack);
            return res.status(500).json({ message: 'Database error occurred.' });
        }

        res.status(200).json(results);
    });
});

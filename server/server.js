const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) =>{
    res.send('Mentor API is running');
});

app.get('/api/mentors', async (req, res) => {
    try{
        const [rows] = await dw.query('SELECT * FROM mentors');
        res.json(rows);
    }catch (error){
        console.error(error);
        res.status(500).json({ message: 'Server error'});
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
})
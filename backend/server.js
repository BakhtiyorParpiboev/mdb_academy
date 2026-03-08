const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const gamificationRoutes = require('./routes/gamification');
const streakRoutes = require('./routes/streak');
const compilerRoutes = require('./routes/compiler');
const userRoutes = require('./routes/user');
const aiRoutes = require('./routes/ai');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/xp', gamificationRoutes);
app.use('/api/streak', streakRoutes);
app.use('/api/compiler', compilerRoutes);
app.use('/api/user', userRoutes);
app.use('/api/ai', aiRoutes);

app.get('/', (req, res) => {
  res.send('Men Dasturchi Bo\'laman API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

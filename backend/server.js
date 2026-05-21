const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/db');

const User = require('./models/User');
const Request = require('./models/Request');
const RequestLog = require('./models/RequestLog');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', require('./routes/authRoutes'));

app.get('/', (req, res) => res.send('SQL Workflow Engine Active...'));

const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true })
  .then(() => {
    console.log('✅ MySQL Database Schema Synced Successfully');
    app.listen(PORT, () => console.log(`🚀 Control node running on port ${PORT}`));
  })
  .catch(err => console.error('❌ Failed to sync DB:', err));
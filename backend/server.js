require('dotenv').config();
const express = require('express');
const cors = require('cors');
const usersRouter = require('./routes/users');
const { initDB } = require('./models/userModel');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Route
app.use('/api/users', usersRouter);

// Port
const PORT = process.env.PORT || 5001;

// Init DB and start server
initDB()
  .then(() => {
    console.log('Database connected.');
    app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('DB init failed', err);
    process.exit(1);
  });

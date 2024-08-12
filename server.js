// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const testCaseRoutes = require('./routes/testCaseRoutes');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Database connection
mongoose.connect('mongodb://localhost:27017/testcases');

// Routes
app.use('/api/testcases', testCaseRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

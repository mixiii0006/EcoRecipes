const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const authRoutes = require('./routes/authRoutes');
const recipeRoutes = require('./routes/recipeRoutes');

// Gunakan route
app.use('/api', authRoutes);
app.use('/api', recipeRoutes);

app.listen(3000, () => console.log(`Server running on http://localhost:3000`));
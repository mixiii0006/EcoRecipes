const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require('./routes/authRoutes');

// Gunakan route
app.use('/api', authRoutes);

app.listen(3000, () => {
  console.log('✅ Backend berjalan di http://localhost:3000');
});

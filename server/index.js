import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import complaintRoutes from './routes/complaints.js';
import userRoutes from './routes/users.js';
import { auth } from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for development (replace with actual database in production)
global.mockDB = {
  users: [],
  complaints: [],
  nextUserId: 1,
  nextComplaintId: 1
};

console.log('Using in-memory storage for development');
console.log('Note: Data will be lost when server restarts');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', auth, complaintRoutes);
app.use('/api/users', auth, userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'QuirkyRoomie API is running',
    database: 'In-memory storage (development mode)'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Database: In-memory storage (development mode)');
});
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes/api.js';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || 5000, 10);

// Enable CORS for all requests (configured to allow frontend access)
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

// API routes mapping
app.use('/api', apiRouter);

// Base route test
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Aroma Spices Restaurant API',
    status: 'online',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    message: 'Internal server error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

export let activePort = PORT;

// Start the server dynamically by finding an available port if collision occurs
const startServer = (port) => {
  const server = app.listen(port, () => {
    activePort = port;
    console.log(`Server is running on port ${port}`);
    console.log(`Open API test: http://localhost:${port}/api/menu`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is in use, trying port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });
};

startServer(PORT);

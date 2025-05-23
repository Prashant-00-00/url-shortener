import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import urlRoutes from './routes/url.js';

dotenv.config();
const app = express();

// Middleware
app.use((req, res, next) => {
  console.log('Incoming request:', {
    method: req.method,
    path: req.path,
    origin: req.headers.origin,
    headers: req.headers
  });
  next();
});

app.use(cors({
  origin: true, // Allow all origins
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 'Accept'],
  exposedHeaders: ['Content-Length', 'Content-Range'],
  credentials: true,
  maxAge: 86400 // 24 hours
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI, {
  dbName: 'url_shortener'
})
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// Routes
app.use('/', urlRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

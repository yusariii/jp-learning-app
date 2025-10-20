require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

const adminRoutes = require('./routes/admin/index.route');
adminRoutes(app)

// 404 page
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Internal Server Error' });
});

// DB
const MONGODB_URI = process.env.MONGO_URL;
const PORT = process.env.PORT;

async function start() {
  await mongoose.connect(MONGODB_URI);
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
}

if (require.main === module) {
  start().catch((e) => {
    console.error('Mongo connect/start error:', e);
    process.exit(1);
  });
}

module.exports = app;

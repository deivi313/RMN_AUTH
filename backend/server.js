// server.js — sets up Express, mounts the routes and starts the server.
const express = require('express');
const cors = require('cors');
const config = require('./config');
const { sequelize, User } = require('./models');
const { authenticate, authorize } = require('./middleware');

const app = express();

// ---------- middleware (runs on every request, in this order) ----------
app.use(cors({ origin: config.clientUrl })); // only our React app may call this API
app.use(express.json()); // turns the JSON body into req.body
app.use((req, res, next) => {
  req.body ??= {}; // Express 5 leaves req.body undefined when the request has no body
  next();
});

// ---------- routes ----------
app.use('/api/auth', require('./routes/auth')); // public: register + login
app.use('/api/products', authenticate, require('./routes/products')); // any logged-in user
app.use('/api/users', authenticate, authorize('admin'), require('./routes/users')); // admin only

// ---------- unknown routes + errors (always last) ----------
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// Express 5 sends errors from async routes here automatically, so routes need no try/catch
app.use((err, req, res, next) => {
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({ message: 'Email is already registered' });
  }
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({ message: err.errors.map((e) => e.message).join(', ') });
  }
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({ message: 'The referenced user does not exist' });
  }

  const status = err.status || 500;
  if (status === 500) console.error(err); // log real bugs, never send details to the client
  res.status(status).json({ message: status === 500 ? 'Internal server error' : err.message });
});

// ---------- start ----------
const start = async () => {
  try {
    await sequelize.authenticate(); // stop early if MySQL is unreachable
    await sequelize.sync(); // creates the tables if they don't exist yet

    // create the first admin (from config.js) if it doesn't exist
    await User.findOrCreate({
      where: { email: config.admin.email },
      defaults: { name: 'Admin', password: config.admin.password, role: 'admin' },
    });

    app.listen(config.port, () => console.log(`API running on http://localhost:${config.port}`));
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();

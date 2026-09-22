const express = require('express');
const cors = require('cors');
const config = require('./config');
const { sequelize, User } = require('./models');
const { authenticate, authorize } = require('./middleware');

const app = express();


app.use(cors({ origin: config.clientUrl }));
app.use(express.json());
app.use((req, res, next) => {
  req.body ??= {}; 
  next();
});

// ---------- routes ----------
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', authenticate, require('./routes/products'));
app.use('/api/users', authenticate, authorize('admin'), require('./routes/users'));

app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

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
  res.status(status).json({ message: status === 500 ? 'Internal server error' : err.message });
});

// ---------- start ----------
const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

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

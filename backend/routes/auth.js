const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { authenticate } = require('../middleware');
const { jwt: jwtConfig } = require('../config');

const signToken = (user) =>
  jwt.sign({ id: user.id }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password || password.length < 6) {
    return res
      .status(400)
      .json({ message: 'Name, email and a password of at least 6 characters are required' });
  }

  const user = await User.create({ name, email, password });
  res.status(201).json({ token: signToken(user), user });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await User.findOne({ where: { email } });
  if (!user || !(await user.checkPassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  res.json({ token: signToken(user), user });
});

router.get('/me', authenticate, (req, res) => res.json(req.user));

module.exports = router;

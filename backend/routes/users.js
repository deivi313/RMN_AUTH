// Everything here is admin-only (the check happens in server.js when the route is mounted)
const router = require('express').Router();
const { Op } = require('sequelize');
const { User, Product } = require('../models');

// GET /api/users                 -> every user with their products (LEFT JOIN)
// GET /api/users?product=laptop  -> only users who own a product whose name contains "laptop"
router.get('/', async (req, res) => {
  const { product } = req.query;

  const include = { model: Product, as: 'products' };
  if (product) {
    include.where = { name: { [Op.like]: `%${product}%` } };
    include.required = true; // LEFT JOIN becomes INNER JOIN, so users without a match are dropped
  }

  const users = await User.findAll({ include, order: [['id', 'ASC']] });
  res.json(users);
});

// GET /api/users/:id
router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id, { include: { model: Product, as: 'products' } });
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

// POST /api/users
router.post('/', async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }
  const user = await User.create({ name, email, password, role });
  res.status(201).json(user);
});

// PUT /api/users/:id
router.put('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (!req.body.password) delete req.body.password; // empty password = keep the current one
  await user.update(req.body, { fields: ['name', 'email', 'password', 'role'] });
  res.json(user);
});

// DELETE /api/users/:id
router.delete('/:id', async (req, res) => {
  if (Number(req.params.id) === req.user.id) {
    return res.status(400).json({ message: 'You cannot delete your own account' });
  }
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  await user.destroy(); // their products are deleted too (ON DELETE CASCADE)
  res.status(204).send();
});

module.exports = router;

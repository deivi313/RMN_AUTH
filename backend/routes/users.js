const router = require('express').Router();
const { Op } = require('sequelize');
const { User, Product } = require('../models');

router.get('/', async (req, res) => {
  const { product } = req.query;

  const include = { model: Product, as: 'products' };
  if (product) {
    include.where = { name: { [Op.like]: `%${product}%` } };
    include.required = true;
  }

  const users = await User.findAll({ include, order: [['id', 'ASC']] });
  res.json(users);
});


router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id, { include: { model: Product, as: 'products' } });
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

router.post('/', async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }
  const user = await User.create({ name, email, password, role });
  res.status(201).json(user);
});

router.put('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (!req.body.password) delete req.body.password; // empty password = keep the current one
  await user.update(req.body, { fields: ['name', 'email', 'password', 'role'] });
  res.json(user);
});

router.delete('/:id', async (req, res) => {
  if (Number(req.params.id) === req.user.id) {
    return res.status(400).json({ message: 'You cannot delete your own account' });
  }
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  await user.destroy();
  res.status(204).send();
});

module.exports = router;

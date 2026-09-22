const router = require('express').Router();
const { Product, User } = require('../models');
const { authorize } = require('../middleware');

const isAdmin = (user) => user.role === 'admin';

// GET /api/products — the logged-in user's own products
router.get('/', async (req, res) => {
  const products = await Product.findAll({
    where: { userId: req.user.id },
    order: [['createdAt', 'DESC']],
  });
  res.json(products);
});

// GET /api/products/all (admin) — every product joined with its owner
router.get('/all', authorize('admin'), async (req, res) => {
  const products = await Product.findAll({
    include: { model: User, as: 'owner' },
    order: [['createdAt', 'DESC']],
  });
  res.json(products);
});

// POST /api/products — users create for themselves; an admin can pass userId to assign it
router.post('/', async (req, res) => {
  const { name, description, price, userId } = req.body;
  if (!name) return res.status(400).json({ message: 'Product name is required' });

  const ownerId = isAdmin(req.user) && userId ? userId : req.user.id;
  const product = await Product.create({ name, description, price, userId: ownerId });
  res.status(201).json(product);
});

// PUT /api/products/:id (admin) — edit, or reassign to another user with userId
router.put('/:id', authorize('admin'), async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  // `fields` is a whitelist: nothing else in the body can be written
  await product.update(req.body, { fields: ['name', 'description', 'price', 'userId'] });
  res.json(product);
});

// DELETE /api/products/:id — owners delete their own, admins delete any
router.delete('/:id', async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  if (!isAdmin(req.user) && product.userId !== req.user.id) {
    return res.status(403).json({ message: 'You can only delete your own products' });
  }

  await product.destroy();
  res.status(204).send();
});

module.exports = router;

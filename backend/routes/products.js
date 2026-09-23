const router = require('express').Router();
const { Product, User } = require('../models');
const { authorize } = require('../middleware');

const isAdmin = (user) => user.role === 'admin';

router.get('/', async (req, res) => {
  const products = await Product.findAll({
    where: { userId: req.user.id },
    order: [['createdAt', 'DESC']],
  });
  res.json(products);
});

router.get('/all', authorize('admin'), async (req, res) => {
  const products = await Product.findAll({
    include: { model: User, as: 'owner' },
    order: [['createdAt', 'DESC']],
  });
  res.json(products);
});

router.post('/', async (req, res) => {
  const { name, description, price, userId } = req.body;
  if (!name) return res.status(400).json({ message: 'Product name is required' });

  const ownerId = isAdmin(req.user) && userId ? userId : req.user.id;
  const product = await Product.create({ name, description, price, userId: ownerId });
  res.status(201).json(product);
});

router.put('/:id', authorize('admin'), async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  await product.update(req.body, { fields: ['name', 'description', 'price', 'userId'] });
  res.json(product);
});

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

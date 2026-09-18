const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
app.use(express.json());

const userRoutes = require('./routes/userRoute')
app.use("/user", userRoutes)

const sequelize = new Sequelize('rmn_auth', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

const User = require('./models/user')(sequelize, DataTypes);
const Product = require('./models/product')(sequelize, DataTypes);

User.hasMany(Product, { foreignKey: 'user_id', onDelete: 'SET NULL' });
Product.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

app.get('/users-with-products', async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{
        model: Product,
        required: false
      }]
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    await sequelize.sync();

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

startServer();
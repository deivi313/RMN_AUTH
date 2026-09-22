const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { db } = require('./config');

const sequelize = new Sequelize(db.name, db.user, db.password, {
  host: db.host,
  port: db.port,
  dialect: 'mysql',
  logging: false,
});

const User = sequelize.define(
  'User',
  {
    name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    email: {
<<<<<<< HEAD
      type: DataTypes.STRING(150),
=======
      type: DataTypes.VARCHAR(150),
>>>>>>> 99a39f88c1b8db42b7c6b06c6afd1d222cb711d6
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
<<<<<<< HEAD
    password: { type: DataTypes.STRING, allowNull: false },
=======
    password: { type: DataTypes.VARCHAR, allowNull: false },
>>>>>>> 99a39f88c1b8db42b7c6b06c6afd1d222cb711d6
    role: { type: DataTypes.ENUM('user', 'admin'), allowNull: false, defaultValue: 'user' },
  },
  { tableName: 'users' }
);

User.beforeSave(async (user) => {
  if (user.changed('password')) {
    user.password = await bcrypt.hash(user.password, 10);
  }
});

User.prototype.checkPassword = function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

User.prototype.toJSON = function () {
  const { password, ...safeValues } = this.get();
  return safeValues;
};

const Product = sequelize.define(
  'Product',
  {
<<<<<<< HEAD
    name: { type: DataTypes.STRING(150), allowNull: false },
=======
    name: { type: DataTypes.VARCHAR(150), allowNull: false },
>>>>>>> 99a39f88c1b8db42b7c6b06c6afd1d222cb711d6
    price: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: false,
    },
  },
  { tableName: 'products' }
);

const foreignKey = { name: 'userId', allowNull: false };
User.hasMany(Product, { foreignKey, as: 'products', onDelete: 'CASCADE' });
Product.belongsTo(User, { foreignKey, as: 'owner', onDelete: 'CASCADE' });

module.exports = { sequelize, User, Product };

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
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: { type: DataTypes.STRING, allowNull: false },
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
    name: { type: DataTypes.STRING(150), allowNull: false },
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

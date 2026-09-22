const jwt = require('jsonwebtoken');
const { User } = require('./models');
const { jwt: jwtConfig } = require('./config');

const authenticate = async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Authentication required' });

  let user;
  try {
    const { id } = jwt.verify(token, jwtConfig.secret);
    user = await User.findByPk(id); 
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
  if (!user) return res.status(401).json({ message: 'User no longer exists' });

  req.user = user;
  next();
};

const authorize =
  (...roles) =>
    (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'You do not have permission to do this' });
      }
      next();
    };

module.exports = { authenticate, authorize };

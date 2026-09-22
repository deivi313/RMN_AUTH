const jwt = require('jsonwebtoken');
const { User } = require('./models');
const { jwt: jwtConfig } = require('./config');

// 1) "Who are you?" — checks the token and loads the user
const authenticate = async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Authentication required' });

  let user;
  try {
    const { id } = jwt.verify(token, jwtConfig.secret);
    user = await User.findByPk(id); // read from the DB so role changes apply immediately
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
  if (!user) return res.status(401).json({ message: 'User no longer exists' });

  req.user = user;
  next();
};

// 2) "Are you allowed?" — checks the role, e.g. authorize('admin')
const authorize =
  (...roles) =>
    (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'You do not have permission to do this' });
      }
      next();
    };

module.exports = { authenticate, authorize };

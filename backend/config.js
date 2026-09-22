module.exports = {
  port: 5000,
  clientUrl: 'http://localhost:5173', 

  db: {
    host: 'localhost',
    port: 3001,
    name: 'rmn_auth', 
    user: 'root', 
    password: 'root',
  },

  jwt: {
    secret: 'change-this-to-a-long-random-string',
    expiresIn: '1d',
  },

  admin: {
    email: 'admin@example.com',
    password: 'Admin123!',
  },
};

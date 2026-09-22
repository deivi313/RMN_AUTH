module.exports = {
  port: 5000,
<<<<<<< HEAD
  clientUrl: 'http://localhost:5173',

  db: {
    host: 'localhost',
    port: 3306,
    name: 'rmn_auth',
    user: 'root',
=======
  clientUrl: 'http://localhost:5173', 

  db: {
    host: 'localhost',
    port: 3001,
    name: 'rmn_auth', 
    user: 'root', 
>>>>>>> 99a39f88c1b8db42b7c6b06c6afd1d222cb711d6
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

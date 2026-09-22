module.exports = {
  port: 5000,
  clientUrl: 'http://localhost:5173', // the React app that is allowed to call this API

  db: {
    host: 'localhost',
    port: 3306,
    name: 'rmn_auth', // the database you created with CREATE DATABASE login_app;
    user: 'root', // your MySQL username
    password: 'root', // your MySQL password (use '' if it has none)
  },

  jwt: {
    secret: 'change-this-to-a-long-random-string',
    expiresIn: '1d',
  },

  // this admin account is created automatically the first time the server starts
  admin: {
    email: 'admin@example.com',
    password: 'Admin123!',
  },
};

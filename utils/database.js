const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME || 'chat-app' , process.env.DB_USER || 'root', process.env.DB_PASSWORD || '8574421120', {
    dialect: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    timezone: '+05:30',
  });

module.exports = sequelize;
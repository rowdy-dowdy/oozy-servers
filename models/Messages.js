const db = require('../db/index.js');
const Sequelize = require('sequelize')

const Message = db.define('message', {
  isRead: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  senderID: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  body: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
})

module.exports = Message
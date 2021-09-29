const db = require('../db/index.js');
const Sequelize = require('sequelize')

const UserRelationship = db.define('user_relationship', {
  relatingUserID: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  relatedUserID: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

module.exports = UserRelationship
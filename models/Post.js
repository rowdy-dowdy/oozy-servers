const db = require('../db/index.js');
const Sequelize = require('sequelize')

const User = require('./User.js')

const Post = db.define('post', {
  content: {
    type: Sequelize.Text,
    allowNull: false
  }
})

Post.belongsTo(User, { foreignKey: 'userId' })

module.exports = Post
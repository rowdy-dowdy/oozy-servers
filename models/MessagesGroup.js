const db = require('../db/index.js');
const Sequelize = require('sequelize')

const UserMessagesGroup = require('./UserMessagesGroup.js')
const Messages = require('./Messages.js')

const MessagesGroup = db.define('messages_group', {
  title: {
    type: Sequelize.STRING
  },
  avatar: {
    type: Sequelize.STRING,
    defaultValue: ''
  }
})

MessagesGroup.hasMany(UserMessagesGroup,{ foreignKey: 'messagesGroupId' })
MessagesGroup.hasMany(Messages,{ foreignKey: 'MessagesGroupId' })

module.exports = MessagesGroup
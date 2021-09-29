const db = require('../db/index.js');
const Sequelize = require('sequelize')

const User = require('./User.js')
// const MessagesGroup = require('./MessagesGroup.js')

const UserMessagesGroup = db.define('user_messages_group', {})

UserMessagesGroup.belongsTo(User, { foreignKey: 'userId' })
// UserMessagesGroup.belongsTo(MessagesGroup, { foreignKey: 'messagesGroupsId' })

module.exports = UserMessagesGroup
const MessagesGroup = require('../models/MessagesGroup.js');
const UserMessagesGroup = require('../models/UserMessagesGroup.js');
const Messages = require('../models/Messages.js');
const { Op } = require("sequelize");

module.exports = {
  getAllMessagesGroupId: async (req, res) => {
    try {
      
      var user = req.user

      var result = await MessagesGroup.findAll({
        attributes: ['id'],
        include: {
          model: UserMessagesGroup,
          attributes: [],
          where: {
            userId: user.id
          }
        }
      })


      res.json(result)

    } catch (err) {
      console.log(err);
      res.status(err.status || 400).send({message: err.error || ''})
    }
  },

  getMessagesGroupById: async (req, res) => {
    try {
      
      var user = req.user
      var messagesGroupId = req.params.id

      var result = await MessagesGroup.findOne({
        include: [
          {
            model: Messages,
          },
          {
            model: UserMessagesGroup,
            attributes: [],
            where: {
              userId: user.id
            }
          }
        ],
        where: {
          id: messagesGroupId
        }
      })

      res.json(result)

    } catch (err) {
      console.log(err);
      res.status(err.status || 400).send({message: err.error || ''})
    }
  },


  createMessagesGroup: async (req, res) => {
    try {

      var listUserId = req.body.listUserId
      var title = req.body.title || null

      if (listUserId.length < 2) {
        throw {message: 'Phải có ít nhất 2 thành viên trong nhóm trò chuyện'}
      }

      var groupIdByUserId = await MessagesGroup.findOne({
        attributes: ['id'],
        include: [
          {
            model: UserMessagesGroup,
            attributes: [],
            where: {
              userId: listUserId[0]
            }
          }
        ]
      })

      var userGroupByUserId = await UserMessagesGroup.findAll({
        attributes: ['userId'],
        where: {
          messagesGroupsId: groupIdByUserId.id
        }
      })

      if (userGroupByUserId) {

        if(userGroupByUserId.findIndex(v => v.userId == listUserId[1]) >= 0 
          && userGroupByUserId.length == 2) {

          res.json({id: groupIdByUserId.id})
        }
      }

      var groupInfo = await MessagesGroup.create({
        title
      })

      // console.log(listUserId);

      var listUserMessagesGroup = listUserId.reduce((pre,cur) => {
        return [...pre, {
          userId: cur,
          messagesGroupsId: groupInfo.id
        }]
      },[])

      await UserMessagesGroup.bulkCreate(listUserMessagesGroup)
      res.json({id: groupInfo.id})

    } catch (err) {
      console.log(err);
      res.status(err.status || 400).send({message: err.error || ''})
    }
  },


  sendMessagesToGroup: async (req, res) => {
    try {

      var user = req.user
      var messagesGroupId = req.params.id
      var body = req.body.body || ""

      var messagesGroup = await MessagesGroup.findOne({
        where: {
          id: messagesGroupId
        }
      })

      if (messagesGroup == null) {
        throw {message: 'Nhóm không tồn tại'}
      }

      let newMessages = {
        senderID: user.id,
        messagesGroupId: messagesGroupId,
        body: body
      }

      var result = await Messages.create(newMessages)

      res.json(result)

    } catch (err) {
      console.log(err);
      res.status(err.status || 400).send({message: err.error || ''})
    }
  }
}
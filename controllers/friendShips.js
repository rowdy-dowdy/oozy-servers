const UserRelationship = require('../models/UserRelationship.js');
const { Op } = require("sequelize");

module.exports = {
  getAll: async (req, res) => {
    try {
      
      var user = req.user

      var result = await UserRelationship.findAll({
        where: {
          type: 'friends',
          [Op.or]: [
            { relatingUserID: user.id },
            { relatedUserID: user.id }
          ]
        }
      })

      res.json(result)

    } catch (err) {
      console.log(err);
      res.status(err.status || 400).send({message: err.error || ''})
    }
  },


  getRequestSent: async (req, res) => {
    try {
      
      var user = req.user

      var result = await UserRelationship.findAll({
        where: {
          type: 'request-sent',
          relatingUserID: user.id
        }
      })

      res.json(result)

    } catch (err) {
      console.log(err);
      res.status(err.status || 400).send({message: err.error || ''})
    }
  },


  getRequestReceived: async (req, res) => {
    try {
      
      var user = req.user

      var result = await UserRelationship.findAll({
        where: {
          type: 'request-sent',
          relatedUserID: user.id
        }
      })

      res.json(result)

    } catch (err) {
      console.log(err);
      res.status(err.status || 400).send({message: err.error || ''})
    }
  },


  getType: async (req, res) => {
    try {
      
      var user = req.user
      var friendShipId = req.params.id

      var result = await UserRelationship.findOne({
        attributes: ['type'],
        where: {
          [Op.or]: [
            { relatingUserID: user.id },
            { relatedUserID: user.id }
          ],
          [Op.or]: [
            { relatingUserID: friendShipId },
            { relatedUserID: friendShipId }
          ],
        }
      })

      // "request-sent"  : đã gửi yêu cầu kết bạn
      // ""              : chưa có mối quan hệ nào
      // "friends"       : là bạn của nhau

      res.json(result?.type || "")

    } catch (err) {
      console.log(err);
      res.status(err.status || 400).send({message: err.error || ''})
    }
  },


  create: async (req, res) => {
    try {
      
      var user = req.user
      var userAddId = req.params.id

      console.log(user,userAddId);

      if (user.id == userAddId) {
        throw {message: 'Bạn đã là bạn của chính bạn'}
      }

      var findRelationshipUser = await UserRelationship.findOne({
        where: {
          relatingUserID: user.id,
          relatedUserID: userAddId
        }
      })

      if (findRelationshipUser) {
        throw {message: 'Đã tồn tại một mối quan hệ giữa 2 user'}
      }

      var findRelationship = await UserRelationship.findOne({
        where: {
          relatingUserID: userAddId
        }
      })

      console.log(findRelationship);

      if (findRelationship) {

        findRelationship.type = 'friends'

        await findRelationship.save({ fields: ['type']})
      } 
      else {

        var userRelationshipTemp = {
          relatingUserID: user.id,
          relatedUserID: userAddId,
          type: 'request-sent'
        }

        await UserRelationship.create(userRelationshipTemp)
      }

      res.json({message: 'Success'})

    } catch (err) {
      console.log(err);
      res.status(err.status || 400).send({message: err.error || ''})
    }
  },
  

  confirm: async (req, res) => {
    try {
      
      var user = req.user
      var userAddId = req.params.id

      var findRelationship = await UserRelationship.findOne({
        where: {
          relatingUserID: userAddId,
          relatedUserID: user.id
        }
      })

      console.log(findRelationship);

      if (findRelationship == null) {
        throw {message: 'Không thể xác nhận do không tìm thấy yêu cầu kết bạn'}
      }

      findRelationship.type = "friends"
      await findRelationship.save({ fields: ['type']})

      res.json({message: 'Success'})

    } catch (err) {
      console.log(err);
      res.status(err.status || 400).send({message: err.error || ''})
    }
  },


  cancel: async (req, res) => {
    try {

      var user = req.user
      var userAddId = req.params.id

      var findRelationship = await UserRelationship.findOne({
        where: {
          [Op.or]: [
            { relatingUserID: user.id, relatedUserID: userAddId },
            { relatingUserID: userAddId, relatedUserID: user.id}
          ]
        }
      })

      if (findRelationship) {

        await findRelationship.destroy()
        res.json({message: 'Success'})
      }
      else {
        throw {message: 'Không tìm thấy yêu cầu kết bạn'}
      }


    } catch (err) {
      console.log(err);
      res.status(err.status || 400).send({message: err.error || ''})
    }
  }
}
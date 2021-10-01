const User = require('../models/User.js');
const validator = require('../helpers/validator.js')
const { Op, Sequelize } = require("sequelize");

module.exports = {
  getUserById: async (req, res) => {
    try {

      var userId = req.params.id

      var userInfo = await User.findOne({
        where: {
          id: userId
        }
      })

      if (userInfo == null) {
        throw {message: 'Tài khoản không tồn tại'}
      }

      res.json(userInfo)

    } catch (err) {
      console.log(err);
      res.status(err.status || 400).send({message: err.error || ''})
    }
  },


  getUserByUsername: async (req, res) => {
    try {

      var username = req.params.username

      var userInfo = await User.findOne({
        where: {
          username: {
            [Op.iLike]: username
          }
        }
      })

      if (userInfo == null) {
        throw {message: 'Tài khoản không tồn tại'}
      }

      res.json(userInfo)

    } catch (err) {
      console.log(err);
      res.status(err.status || 400).send({message: err.error || ''})
    }
  },


  getUserByEmail: async (req, res) => {
    try {

      var email = req.params.email

      if (!validator.isEmail(email))
        throw {message: 'Định dạng email không hợp lệ'}

      var userInfo = await User.findOne({
        where: {
          email: email
        }
      })

      if (userInfo == null) {
        throw {message: 'Email chưa tồn tại'}
      }

      res.json(userInfo)

    } catch (err) {
      console.log(err);
      res.status(err.status || 400).send({message: err.error || ''})
    }
  },


  getUserByPhone: async (req, res) => {
    try {

      var phone = req.params.phone

      if (!validator.isMobilePhone(phone))
        throw {message: 'Số điện thoại không hợp lệ'}

      var userInfo = await User.findOne({
        where: {
          phone: phone
        }
      })

      if (userInfo == null) {
        throw {message: 'Số điện thoại chưa tồn tại'}
      }

      res.json(userInfo)

    } catch (err) {
      console.log(err);
      res.status(err.status || 400).send({message: err.error || ''})
    }
  },


  updateUserById: async (req, res) => {
    try {

      var userId = req.params.id

      let newUser = {
        name : validator.trimFull(req.body.name || ""),
        email : (req.body.email !== null && req.body.email !== undefined) ? req.body.email : null,
        phone : (req.body.phone !== null && req.body.phone !== undefined) ? req.body.phone : null,
        birthday : new Date(req.body.birthday)
      }

      // check validator data

      if (newUser.name == "" || newUser.name.length < 6) {
        throw {message: 'Tên quá ngắn'}
      }

      if (newUser.email != null || newUser.phone != null) {
        if (newUser.email != null) {
          if (!validator.isEmail(newUser.email))
            throw {message: 'Định dạng email không hợp lệ'}
        }
        else {
          newUser.email = null
          if (!validator.isMobilePhone(newUser.phone))
            throw {message: 'Số điện thoại không hợp lệ'}
        }
      }else {
        throw {message: 'No email or phone number'}
      }

      // find user

      var userInfo = await User.findOne({
        where: {
          id: userId
        }
      })

      if (userInfo == null) {
        throw {message: 'Tài khoản không tồn tại'}
      }

      userInfo.name = newUser.name
      userInfo.email = newUser.email
      userInfo.phone = newUser.phone
      userInfo.birthday = newUser.birthday

      await userInfo.save()

      res.json(userInfo)

    } catch (err) {
      console.log(err);
      res.status(err.status || 400).send({message: err.error || ''})
    }
  },


  getRandomUser: async (req, res) => {
    try {

      var user = req.user
      var limit = req.params.limit || 3

      const listUser = await User.findAll({
        limit: limit,
        where: {
          id: {[Op.ne]: user.id,}
        },
        order: [Sequelize.literal('RANDOM()')]
      })

      res.json(listUser)

    } catch (err) {
      res.status(err.status || 400).send(err)
    }
  }
}
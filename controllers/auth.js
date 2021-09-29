const User = require('../models/User.js');
const jwtHelper = require('../helpers/jwt.helper.js');
const validator = require('../helpers/validator.js')
const { Op } = require("sequelize");

module.exports = {
  //
  // LOGIN
  //
  login: async (req, res) => {
    try {
      
      let userLogin = {
        username : (req.body.username !== null && req.body.username !== undefined) ? req.body.username : "",
        email : (req.body.email !== null && req.body.email !== undefined) ? req.body.email : "",
        phone : (req.body.phone !== null && req.body.phone !== undefined) ? req.body.phone : "",
        password: req.body.password
      }

      var userInfo = null

      if (userLogin.username != "") {
        userInfo = await User.scope('withPassword').findOne({
          where: {
            username: {
              [Op.iLike]: userLogin.username
            }
          }
        });
      }
      else if (userLogin.email != "") {
        userInfo = await User.scope('withPassword').findOne({
          where: {
            email: userLogin.email
          }
        });
      }
      else if (userLogin.phone != "") {
        userInfo = await User.scope('withPassword').findOne({
          where: {
            phone: userLogin.phone
          }
        });
      }
      else {
        throw {message: 'No username or email or phone number'}
      }

      if (userInfo == null) {
        throw {message: 'Tài khoản không tồn tại'}
      }

      const checkPass = await userInfo.checkPassword(userLogin.password)
      
      if (checkPass) {

        let userTemp = userInfo.get()
        delete userTemp.password

        let token = await jwtHelper.createToken({
          id: userTemp.id,
          username: userTemp.username,
          name: userTemp.name,
          color: userTemp.color
        })

        res.cookie('x-access-token',token, {httpOnly: true}) 
        res.json(userTemp)
      } 
      else {
        throw {message: 'Mật khẩu không chính xác'}
      }

    } catch (err) {
      console.log(err);
      res.status(err.status || 400).send({message: err.error || ''})
    }
  },
  
  //
  // LOGGED
  //
  logged: async (req, res) => {
    try {
      let user_id = req.user.user_id
      const userInfo = await userModel.getInfo(user_id)

      res.json(userInfo)
    } catch (err) {
      console.log(err);
      res.status(err.status || 400).send({message: err.error || ''})
    }
  },

  // 
  // REGISTER
  // 
  register: async (req, res) => {
    try {

      let newUser = {
        name : validator.trimFull(req.body.name || ""),
        password : req.body.password,
        email : (req.body.email !== null && req.body.email !== undefined) ? req.body.email : null,
        phone : (req.body.phone !== null && req.body.phone !== undefined) ? req.body.phone : null,
        birthday : new Date(req.body.birthday),
        color: req.body.color
      }
      
      // check validator data

      if (newUser.name == "" || newUser.name.length < 6) {
        throw {message: 'Tên quá ngắn'}
      }

      if (!validator.isStrongPassword(newUser.password)) {
        throw {message: 'Mật khẩu phải dài ít nhất 8 ký tự, bao gồm ít nhất 1 chữ in, 1 chữ thường, 1 số và 1 ký tự đặc biệt'}
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

      let colors = ['rose','amber','lime','violet','sky']
      if (colors.findIndex(v => v == newUser.color) < 0) {
        newUser.color = colors[0]
      }

      const userInfo = await User.create(newUser)

      let userTemp = userInfo.get()
      delete userTemp.password

      let token = await jwtHelper.createToken({
        id: userTemp.id,
        username: userTemp.username,
        name: userTemp.name,
        color: userTemp.color
      })

      res.cookie('x-access-token',token, {httpOnly: true}) 
      res.json(userTemp)


    } catch (err) {
      console.log(err);
      res.status(err.status || 400).send({message: err.error || ''})
    }
  }
}
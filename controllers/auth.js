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
        username : req.body.username,
        password: req.body.password
      }

      if (userLogin.username == "" || userLogin.username == null || userLogin.username == undefined) {
        throw {message: 'Dữ liệu không đầy đủ'}
      }

      var userInfo = null

      userInfo = await User.scope('withPassword').findOne({
        where: {
          username: {
            [Op.iLike]: userLogin.username
          }
        }
      });
      
      if (userInfo == null) {
        userInfo = await User.scope('withPassword').findOne({
          where: {
            email: userLogin.username
          }
        });
      }
      
      if (userInfo == null) {
        userInfo = await User.scope('withPassword').findOne({
          where: {
            phone: userLogin.username
          }
        });
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
      res.status(err.status || 400).send(err)
    }
  },
  
  //
  // LOGGED
  //
  logged: async (req, res) => {
    try {
      var user = req.user
      const userInfo = await User.findOne({
        where: {
          id: user.id
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

  //
  // LOGOUT
  //
  logout: async (req, res) => {
    try {
      res.cookie('x-access-token',"del", {httpOnly: true}) 
      res.json({
        guest: true
      })

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
        email : (req.body.email !== "" && req.body.email !== undefined) ? req.body.email : null,
        phone : (req.body.phone !== "" && req.body.phone !== undefined) ? req.body.phone : null,
        birthday : new Date(req.body.birthday)
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
      newUser.color = colors[Math.floor(Math.random() * colors.length)]

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
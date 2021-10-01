const db = require('../db/index.js');
const { Op, Sequelize } = require('sequelize')
const argon2 = require('argon2');

const User = db.define('user', {
  username: {
    type: Sequelize.STRING,
    unique: true
  },
  email: {
    type: Sequelize.STRING,
    unique: true
  },
  phone: {
    type: Sequelize.STRING,
    unique: true
  },
  birthday: {
    type: Sequelize.DATE,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  avatar: {
    type: Sequelize.STRING,
    defaultValue: ''
  },
  color: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {
  freezeTableName: true,
  defaultScope: {
    attributes: { exclude: ['password'] },
  },
  scopes: {
    withPassword: {
      attributes: {},
    }
  }
})

User.prototype.checkPassword = async function(password) {
  return await argon2.verify(this.password, password);
};

User.beforeCreate(async (user, options) => {
  // console.log('before create');
  try {

    // password
    let hashedPassword = await argon2.hash(user.password);
    user.password = hashedPassword;


    // name
    let name = user.name

    // regex test /^\w+$/
    let nameReplace = name.replace(/([!@&-=\^\[\]\/\\#,+()$~%.'":*?<>{}]|[^\x00-\x7F]|[\s])/g, "")
    let max = 9999,
        min = 1000,
        checkCount = 0
      
    do {
      checkCount++;
      max = max * 10 + 9;
      min = min * 10;

      var createUsername = nameReplace + Math.floor(Math.random() * (max - min) + min)

      var checkUsername = await User.findOne({
        attributes: ['username'],
        username: {
          [Op.iLike]: createUsername
        }
      });
    } while (checkUsername && checkCount < 5)

    user.username = createUsername;
    // console.log(user);

    if (user.username == null)
      throw 'Can not created username'

  } catch (err) {
    throw err
  }
});

module.exports = User
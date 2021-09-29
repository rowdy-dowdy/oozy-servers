const validator = require('validator');

validator.trimFull = (str) => {
  return str.toString().trim().replace(/ +/g,' ')
}

module.exports = validator
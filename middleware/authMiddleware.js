const jwtHelper = require('../helpers/jwt.helper.js')
const User = require('../models/User.js')

const isAuth = async (req, res, next) => {
	const token = req.body.token || req.query.token || req.cookies["x-access-token"];

	if (token) {

    try {

      var decode = await jwtHelper.verityToken(token)

      let userInfo = await User.findOne({
        where: {
          id: decode.id
        }
      });

      req.user = userInfo;
      
      if (userInfo != null)
        next()
      else
        throw {error:"User not found"}
    
    }
    catch(err) {
      return res.status(401).send(err);
    }
	} 
  else {
    return res.status(401).send({error: "A token is required for authentication"});
  }
}

module.exports = {
  isAuth
};
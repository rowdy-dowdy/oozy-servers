const Sequelize = require('sequelize')
const config = require('../configs/index.js')

const db = new Sequelize(config.database_url)

module.exports = db
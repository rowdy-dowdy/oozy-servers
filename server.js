const express = require('express')
const app = express()
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config();
const db = require('./db/index.js')

// test database
db.authenticate()
  .then(() => console.log('DATABASE connected...'))
  .catch((err) => console.log('Error:' + err));


db.sync({ force: true })
  .then(() => console.log("All models were synchronized successfully."))
  .catch((err) => console.log('Error:' + err));


// import router
const authRoute = require('./routes/auth.js')
const user = require('./routes/user.js')
const friendShips = require('./routes/friendShips.js')
const messages = require('./routes/messages.js')

app.use(express.json())
app.use(cookieParser())
app.use(cors({credentials: true, origin: 'http://localhost:3000'}))

// use router
app.use('/api/auth', authRoute) 
app.use('/api/user', user)
app.use('/api/friendships', friendShips)
app.use('/api/messages', messages)

const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

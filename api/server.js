const path = require('path')
const express = require('express')

const usersRouter = require('./users/users-router.js')
const authRouter = require('./auth/auth-router.js')

const session = require('express-session')
const server = express()
const sessionConfig = {
  name: "nodeLessonSession",
  secret: 'MY_SECRET',
  cookie: {
    maxAge: 8000 * 60,
    secure: false,
    httpOnly: true
  },
  resave: false,
  saveUninitialized: false
}

server.use(session(sessionConfig))


server.use(express.static(path.join(__dirname, '../client')))
server.use(express.json())

server.use('/api/users', usersRouter)
server.use('/api/auth', authRouter)

server.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client', 'index.html'))
})

server.use('*', (req, res, next) => {
  next({ status: 404, message: 'not found!' })
})

server.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  })
})

module.exports = server

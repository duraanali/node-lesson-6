const router = require("express").Router()

const Users = require("./users-model.js")

const { restricted } = require("../auth/auth-middleware")

router.get("/", restricted, (req, res, next) => {

  if (req.session.user == null) {
    res.status(403).json({ message: "You are not logged in"})
    return
  }

  Users.find()
    .then(users => {
      res.status(200).json(users)
    })
    .catch(next)
})


module.exports = router

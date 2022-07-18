const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const Users = require('../users/users-model');

router.post('/register', async (req, res, next) => {
  
    try {
        const { username, password } = req.body;
        const existingUser = await Users.findBy({ username }).first();
        if(existingUser != null) {
            next({ status: 400, message: "username already exists" });
            return;
        }

        const hash = bcrypt.hashSync(password, 10)
        console.log("hash", hash)
        // Database-ka gali
        await Users.add({ username, password: hash });

        res.status(201).json({ message: `You are now registered, ${username}!` });

    } catch(err) {
        next(err);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const existingUser = await Users.findBy({ username }).first();
        if(existingUser == null) {
            next({ status: 401, message: "User does not exist!" });
            return;
        }

        if(bcrypt.compareSync(password, existingUser.password) == false) {
            next({ status: 401, message: "Invalid Credentials" });
            return;
        }

        const token = generateToken(existingUser)
        console.log(token)
        req.session.user = existingUser;

        res.status(200).json({ 
            message: `Welcome back, ${username}!`,
            Token: token
        });

    } catch(err) {
        next(err);
    }
});

function generateToken(user) {
    const payload = {
        subject: user.id,
        username: user.username,
        password: user.password
    };

    const options = {
        expiresIn: '5m'
    }
    const JWT_SECRET = "sirwayn"
    return jwt.sign(payload, JWT_SECRET, options)
}

router.get('/logout', (req, res, next) => {
    if (req.session.user == null) {
        res.status(400).json({ message: "You are not logged in"})
    }

    const username = req.session.user.username;
    req.session.destroy(err => {
        if(err != null) {
            res.status(500).json({ message: "Logout Failed"})
        }

        res.status(200).json({ message: `You are now logged out, ${username}` })
    })
});

module.exports = router;
const jwt = require('jsonwebtoken');

const User = require('../users/users-model');
const JWT_SECRET = "sirwayn"
const restricted = (req, res, next ) => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJqZWN0Ijo1LCJ1c2VybmFtZSI6Im1vaGFtZWQiLCJwYXNzd29yZCI6IiQyYiQxMCQ3ZE9rNk9yVUdIek15SVZ1bU5MMzZld2x0M29vNEx0aGU1Z0kuZmpOcFVWcVp3bS50QXZNeSIsImlhdCI6MTY1NjUyNzk5MiwiZXhwIjoxNjU2NTI4MjkyfQ.qdgzyUytDcuMdSZPZDbnJoIN5FNNcKc-LbnjzX3lMwE";
    console.log("RESITERED FUN")
    if (token) {
        console.log("TOKEN SUCCES")
        jwt.verify(token, JWT_SECRET, async (err, decoded) => {
            if(err != null) {
                res.status(401).json({ message: 'access is restricted' });
                return;
            }

            const user = await User.findById(decoded.subject);
            console.log("USER", user)
            if (user == null) {
                res.status(401).json({ message: 'access is restricted' });
                return;
            }
            
            console.log("decoded", decoded)
            req.decodedJwt = decoded
            console.log("req.decodedJwt", req.decodedJwt)
            next();

        })
    }
} 

module.exports = {
    restricted
}
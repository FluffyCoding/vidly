const jwt = require('jsonwebtoken');
require('dotenv').config();

function auth(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    let token;
    if (typeof bearerHeader !== "undefined") {
        const bearer = bearerHeader.split(' ');
        token = bearer[1];
    } else {
        return res.status(401).send('Access Denied. No Token is provided');
    }
    try {
        const verify = jwt.verify(token, process.env.JWT_TOKEN_KEY);
        req.user = verify;
        next();
    } catch (ex) {
        return res.status(400).send('Invalid Token');
    }
}

module.exports = auth;

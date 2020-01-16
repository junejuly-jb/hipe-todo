const jwt = require('jsonwebtoken');
const phrase = '!@#$%^&*(~~~~1111111ZXCVBNMSDFSDFSDFDIIERE#$%^&*(@#@#@#@';

module.exports = (req, res, next) => {
    if (typeof req.headers.authorization === "undefined") {
        // No authorization header exists on the incoming
        // request, return not authorized and throw a new error 
        return res.status(403).json({ error: "Authentication is required" });
    } else {
       // retrieve the authorization header and parse out the
        // JWT using the split function
        let token = req.headers.authorization.split(" ")[1];

        jwt.verify(token, phrase, { algorithm: "HS256" }, (err, user) => {
            if (err) {  
                // shut them out!
                return res.status(403).json({ error: "Authentication is required" });
            }

            // if the JWT is valid, allow them to hit
            // the intended endpoint/route.
            return next();
        });
    }
};
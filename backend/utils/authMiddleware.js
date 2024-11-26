const jwt = require('jsonwebtoken')

const generate_token = (user) => {
    const token = jwt.sign(
        {id:user._id, username:user.username},
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRATION}
    )
    return token
}

module.exports = generate_token
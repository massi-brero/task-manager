const constants = require('../shared/constants')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        console.log(token)
        const decoded = jwt.verify(token, constants.SALT)
        const user = await User.findOne({
            _id: decoded._id,
            'tokens.token': token
        })

        if (!user) {
            throw new Error()
        }

        req.token = token
        req.user = user
        next()
    } catch (err) {
        console.log(err.message)
        res
            .send({error: 'Please authenticate'})
            .status(401)
    }
}

module.exports = auth
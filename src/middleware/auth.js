const constants = require('../shared/constants')
const User = require('../models/user')
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        console.log(token)
        const decoded = jwt.verify(token, constants.SALT)
        const user = User.findOne({
            _id: decoded._id
        })
        if (decoded)
        next()
    } catch (e) {
        res
            .send({error: 'Please authenticate'})
            .status(401)
    }
}

module.exports = auth
const express = require('express')
const User = require('../models/user')
const dbUtils = require('../db/db.utils')
require('mongoose')


const userRouter = new express.Router()
module.exports = userRouter

apiRouter.post('/api/users', async (req, res) => {

        try {

            const userExists = !!!User.findOne(req.body.email)

            if (userExists) {
                throw new Error('A user with that email already exists.')
            }

            const user = await dbUtils.getResource(req).save();

            res
                .status(201)
                .send({
                    user,
                    token: user.generateAuthToken()
                })
        } catch (e) {
            res
                .status(400)
                .send(e.message)
        }

})

userRouter.post('/api/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        console.log(token)
        res.send({user, token})
    } catch (err) {
        res.status(400).send()
    }
})
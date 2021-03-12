const express = require('express')
const User = require('../models/user')
require('mongoose')

const userRouter = new express.Router()
module.exports = userRouter

userRouter.post('/api/users', async (req, res) => {

        try {

            const userExists = !!!User.findOne(req.body.email)

            if (userExists) {
                throw new Error('A user with that email already exists.')
            }

            const user = await (new User(req.body)).save();

            res
                .status(201)
                .send({
                    user,
                    token: await user.generateAuthToken()
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
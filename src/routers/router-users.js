const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
require('mongoose')

const userRouter = new express.Router()
module.exports = userRouter

userRouter.post('/api/users', async (req, res) => {
  try {
    const userExists = !!!User.findOne(req.body.email)

    if (userExists) {
      throw new Error('A user with that email already exists.')
    }

    const user = await new User(req.body).save()

    res.status(201).send({
      user,
      token: await user.generateAuthToken(),
    })
  } catch (e) {
    res.status(400).send(e.message)
  }
})

userRouter.get('/api/users', auth, async (req, res) => {
  try {
    let result = await User.find()
    res.send(result)
  } catch (e) {
    console.log(e)
    res.status(500).send(e.message)
  }
})

userRouter.get('/api/users/:id', auth, async (req, res) => {
  try {
    const id = req.params.id
    const result = await User.findById(id)

    if (!result) {
      return res.status(404).send()
    }

    res.send(result)
  } catch (e) {
    res.status(500).send(e.message)
  }
})

userRouter.put('/api/:resource/:id', async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'password', 'name', 'age']

  const isValidUpdate = updates.every((prop) =>
    allowedUpdates[resource].includes(prop)
  )

  if (!resources.includes(resource) || !isValidUpdate) {
    res.status(400).send({
      error: 'No such resource',
    })
  }

  const options = {
    new: true,
    runValidators: true,
  }

  try {
    const resource = await User.findById(req.params.id)

    if (!resource) {
      return res.status(404).send()
    }

    updates.forEach((update) => (resource[update] = req.body[update]))
    await resource.save()

    res.send(resource)
  } catch (e) {
    res.status(422).send(e.message)
  }
})

userRouter.post('/api/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password)
    const token = await user.generateAuthToken()
    res.send({ user, token })
  } catch (err) {
    console.log(err)
    const status = err.message.includes(401) ? 401 : 400
    res.status(status).send()
  }
})

userRouter.delete('/api/users/:id', async (req, res) => {
  try {
    const result = await User.findByIdAndDelete(req.params.id)

    if (!result) {
      return res.status(404).send()
    }

    res.send(result)
  } catch (e) {
    res.status(500).send()
    console.log(e)
  }
})

userRouter.post('/api/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token
    })

    await req.user.save()

    res.send()
  } catch (err) {
    res.status(500).send()
  }
})

userRouter.post('/api/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = []
    await req.user.save()

    res.send()
  } catch (err) {
    res.status(500).send()
  }
})

userRouter.get('/api/users/me', auth, async (req, res) => {
  res.send(req.user)
})

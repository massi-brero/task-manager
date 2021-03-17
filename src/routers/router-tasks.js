const express = require('express')
const Task = require('../models/task')
require('mongoose')

const tasksRouter = new express.Router()
module.exports = tasksRouter

tasksRouter.post('/api/tasks', async (req, res) => {
  try {
    try {
      let resinource = await new Task(req.body).save()
      res.status(201).send(resource)
    } catch (e) {
      res.status(400).send(e.message)
    }
  } catch (e) {
    res.status(400).send(e.message)
  }
})

tasksRouter.get('/api/tasks', async (req, res) => {
  try {
    let result = await Task.find()
    res.send(result)
  } catch (e) {
    console.log(e)
    res.status(500).send(e.message)
  }
})

tasksRouter.get('/api/tasks/:id', async (req, res) => {
  try {
    const id = req.params.id
    const result = await Task.findById(id)

    if (!result) {
      return res.status(404).send()
    }

    res.send(result)
  } catch (e) {
    res.status(500).send(e.message)
  }
})

tasksRouter.put('/api/:resource/:id', async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['description', 'completed']

  const isValidUpdate = updates.every((prop) => allowedUpdates.includes(prop))

  if (!isValidUpdate) {
    res.status(400).send({
      error: 'You cannot change this.',
    })
  }

  const options = {
    new: true,
    runValidators: true,
  }

  try {
    const resource = await Task.findById(req.params.id)

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

tasksRouter.delete('/api/tasks/:id', async (req, res) => {
  try {
    const result = await Task.findByIdAndDelete(req.params.id)

    if (!result) {
      return res.status(404).send()
    }

    res.send(result)
  } catch (e) {
    res.status(500).send()
    console.log(e)
  }
})

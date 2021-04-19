const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
require('mongoose')

const tasksRouter = new express.Router()
module.exports = tasksRouter

tasksRouter.post('/api/tasks', auth, async (req, res) => {
  try {
    try {
      let resource = await new Task({
        ...req.body,
        owner: req.user._id,
      }).save()
      res.status(201).send(resource)
    } catch (e) {
      res.status(400).send(e.message)
    }
  } catch (e) {
    res.status(400).send(e.message)
  }
})

tasksRouter.get('/api/tasks', auth, async (req, res) => {
  const match = {}

  if (req.query.completed) {
    match.completed = req.query.completed === 'true'
  }

  try {
    await req.user
      .populate({
        path: 'tasks',
        match,
      })
      .execPopulate()

    res.send(req.user.tasks)
  } catch (e) {
    console.log(e)
    res.status(500).send(e.message)
  }
})

tasksRouter.get('/api/tasks/:id', auth, async (req, res) => {
  try {
    const _id = req.params.id
    const result = await Task.findOne({ _id, owner: req.user._id })

    if (!result) {
      return res.status(404).send()
    }

    res.send(result)
  } catch (e) {
    res.status(500).send(e.message)
  }
})

tasksRouter.put('/api/:resource/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['description', 'completed']

  const isValidUpdate = updates.every((prop) => allowedUpdates.includes(prop))

  if (!isValidUpdate) {
    res.status(400).send({
      error: 'You cannot change this.',
    })
  }

  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })

    if (!task) {
      return res.status(404).send()
    }

    updates.forEach((update) => (task[update] = req.body[update]))
    await task.save()

    res.send(task)
  } catch (e) {
    res.status(422).send(e.message)
  }
})

tasksRouter.delete('/api/tasks/:id', auth, async (req, res) => {
  try {
    const result = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    })

    if (!result) {
      return res.status(404).send()
    }

    res.send(result)
  } catch (e) {
    res.status(500).send()
    console.log(e)
  }
})

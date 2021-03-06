const express = require('express')
const dbUtils = require('../db/db.utils')
require('mongoose')

const resources = ['users', 'tasks']


const apiRouter = new express.Router()
module.exports = apiRouter

apiRouter.post('/api/:resource((?!users).*)', async (req, res) => {
    try {

        try {
            let resource = await dbUtils.getResource(req).save();
            res
                .status(201)
                .send(resource)
        } catch (e) {
            res
                .status(400)
                .send(e.message)
        }
    } catch (e) {
        res
            .status(400)
            .send(e.message)
    }
})

apiRouter.get('/api/:resource', async (req, res) => {
    try {
        let result = await dbUtils.getResource(req).find()
        res.send(result)
    } catch (e) {
        console.log(e)
        res.status(500).send(e.message)
    }
})


apiRouter.get('/api/:resource/:id', async (req, res) => {
    try {
        const id = req.params.id
        const result = await dbUtils.getResource(req).findById(id)

        res.send(result)

        if (!result) {
            return res.status(404).send()
        }

    } catch (e) {
        res.status(500).send(e.message)
    }
})

apiRouter.put('/api/:resource/:id', async (req, res) => {
    const resource = req.params.resource
    const updates = Object.keys(req.body)
    const allowedUpdates = {
        users: ['name', 'password', 'name', 'age'],
        tasks: ['description', 'completed'],
    }

    const isValidUpdate = updates.every((prop) => allowedUpdates[resource].includes(prop))

    if (!resources.includes(resource) || !isValidUpdate) {
        res.status(400).send({
            error: 'No such resource'
        })
    }


    const options = {
        new: true,
        runValidators: true
    }

    try {

        const resource = await dbUtils.getResource(req)
            .findById(req.params.id)

        if (!resource) {
            return res.status(404).send()
        }

        updates.forEach((update) => resource[update] = req.body[update])
        await resource.save()

        res.send(resource)

    } catch (e) {
        res.status(422).send(e.message)
    }
})

apiRouter.delete('/api/:resource/:id', async (req, res) => {
    try {
        const result = await dbUtils
            .getResource(req)
            .findByIdAndDelete(req.params.id)

        if (!result) {
            return res.status(404).send()
        }

        res.send(result)

    } catch (e) {
        res.status(500).send()
        console.log(e)
    }

})
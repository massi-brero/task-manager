const express = require('express')
const db = require('./db/dbHandle')
const dbUtils = require('./db/db.utils')
require('mongoose')
const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.post('/:resource', async (req, res) => {

    try {
        let resource = dbUtils.getResource(req.params.resource, req.body)

        try {
            await resource.save();
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

app.get('/:resource', async (req, res) => {

    try {
        let resource = dbUtils.getResource(req.params.resource);
        const result = await resource.find()
        res.send(result)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

app.get('/:resource/:id', async (req, res) => {
    try {
        const id = req.params.id
        const resource = req.params.resource
        const result = await dbUtils.getResource(resource).findById(id)

        res.send(result)

        if (!result) {
            return res.status(404)
        }

    } catch (e) {
        res.status(500).send(e.message)
    }
})

app.listen(port, async () => {
    console.log(`server listening on ${port}`)

    try {
        await db.startDb()
    } catch (e) {
        console.log(e.message)
    }
})
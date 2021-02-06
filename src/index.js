const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.post('/users', (req, res, next) => {
    console.log(req.body)
    res.send('testing')
})

app.listen(port, () => {
    console.log(`server listening on ${port}`)
})
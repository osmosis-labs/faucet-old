const iterator = require("./faucet")
const express = require('express')
const app = express()
const port = process.env.SERVER_PORT
const cors = require('cors')
const constants = require("./constants")

// const limitReached = (req: express.request, res: express.response) => {
//     log.warn({ ip: req.ip }, 'Unfriendly rate limiter triggered')
//     res.status(429).send('Too many requests. Try again later.')
// }

app.use(express.static('public'))
app.use(cors())
app.use(express.json());       // to support JSON-encoded bodies
app.post('/faucetRequest', async (req, res) => {
    try {
    const response = await iterator.handleFaucetRequest(req)
    console.log("RES::::");
    console.log(response);
    res.send(response)
    } catch (error) {
        console.log(error)
    }
})

iterator.runner()

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})



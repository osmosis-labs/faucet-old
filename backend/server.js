const faucet = require("./faucet");
const express = require('express');
const app = express();
const port = process.env.SERVER_PORT;
const cors = require('cors');
const constants = require("./config/constants");

app.use(cors());
app.use(express.json());
app.post('/request', async (req, res) => {
    try {
        const response = await faucet.handleFaucetRequest(req);
        console.log(response);
        res.send(response)
    } catch (error) {
        console.log(error)
    }
});

app.post('/vote', async (req, res) => {
    try {
        const response = await faucet.handleFaucetVote(req);
        console.log(response);
        res.send(response)
    } catch (error) {
        console.log(error)
    }
});

app.get('/queue', async (req, res) => {
    try {
        const response = await faucet.getQueue(req);
        console.log(response);
        res.send(response)
    } catch (error) {
        console.log(error)
    }
});



app.get('/request', async (req, res) => {
        res.send("You must call this via a post method with the required parameters. <a href='https://github.com/osmosis-labs/faucet'>Learn more</a>")
});

faucet.runner();

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});



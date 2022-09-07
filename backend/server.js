const faucet = require("./faucet");
const config = require("./config/config");
const express = require('express');
const cors = require('cors');

const app = express();
const port = config.port

app.use(express.json());

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // For legacy browser support
}

app.use(cors(corsOptions));

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

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});

faucet.runner();


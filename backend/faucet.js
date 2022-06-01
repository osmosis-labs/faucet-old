const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const config = require("./config/config");

const { Secp256k1HdWallet
} = require("@cosmjs/amino");
const {
    SigningStargateClient,
    GasPrice
} = require("@cosmjs/stargate");
const {
    stringToPath
} = require("@cosmjs/crypto");

const msgSendTypeUrl = "/cosmos.bank.v1beta1.MsgMultiSend";
const {
    MsgMultiSend,
    fromPartial
} = require("cosmjs-types/cosmos/bank/v1beta1/tx");

/*
    Redis Connection
    Default no credential to local host
 */
const redis = require('ioredis')
const client = redis.createClient({
    host: config.redisHost,
    port: config.redisPort,
})
client.on('connect', function() {
    console.log('Redis connected');
});

/*
    Remove whitespaces from string
 */
function trimWhiteSpaces(data) {
    return data.split(' ').join('');
}

/*
    Compose message
 */
function msg(inputs, outputs) {
    return {
        typeUrl: msgSendTypeUrl,
        value: MsgMultiSend.fromPartial({
            inputs: [{
                address: trimWhiteSpaces(inputs), //fromAddress
                coins: [{
                    denom: config.DENOM,
                    amount: (outputs.length * parseInt(config.AMOUNT)).toString(),
                }, ],
            }, ],
            outputs: outputs, //toAddress
        }),
    }
}

/*
    Sign and broadcast message
 */
async function signAndBroadcast(wallet, signerAddress, msgs, fee, memo = '') {
    const cosmJS = await SigningStargateClient.connectWithSigner(config.rpcEndpoint, wallet);
    return await cosmJS.signAndBroadcast(signerAddress, msgs, fee, memo); //DeliverTxResponse, 0 iff success
}

async function processTransaction(wallet,addr,msgs){
    try {
        let faucetQueue
        faucetQueue = await getFaucetQueue();
        const response = await signAndBroadcast(
            wallet,
            addr,
            [msgs], {
                "amount": [{
                    amount: (parseInt(config.gas) * GasPrice.fromString(config.gas_price).amount).toString(),
                    denom: config.DENOM
                }],
                "gas": config.gas
            },
            "Thanks for using Osmosis Faucet"
        );
        faucetQueue.forEach(function(address) {
            removeFromQueue(address)
        })
    } catch (err) {
        console.error('Unable to process transaction')
        throw err
    }
}

async function MnemonicWalletWithPassphrase(mnemonic) {
    const wallet = await Secp256k1HdWallet.fromMnemonic(mnemonic, {
        prefix: config.prefix,
        bip39Password: '',
        hdPaths: [stringToPath(config.HD_PATH)]
    });
    const [firstAccount] = await wallet.getAccounts();
    return [wallet, firstAccount.address];
}

async function validateAccount(userAddress){
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", config.restEndpoint + "/cosmos/auth/v1beta1/accounts/" + userAddress, false); // false for synchronous request
    xmlHttp.send(null);
    const accountResponse = JSON.parse(xmlHttp.responseText);
    console.log("Account Validation Response")
    console.log(accountResponse)
    return accountResponse
}

async function getFaucetQueue() {
    let faucetQueue
    try {
        faucetQueue = await client.lrange('faucetQueue',0, -1)
        console.log("Getting Faucet Queue")
        console.log(faucetQueue);
        return faucetQueue
    } catch (err) {
        console.error('Unable to get queue')
        throw err
    }
}

async function addToQueue(userAddress){
    let addQueue
    try {
        addQueue = await client.lpush(['faucetQueue',userAddress])
        console.log(userAddress, "ADDED TO LIST Count:",+addQueue);
    } catch (err) {
        console.error('addQueue: could not increment key')
        throw err
    }
}

async function removeFromQueue(address) {
    console.log("Removing address"+address)
    let removeFromQueue
    try {
        removeFromQueue = await client.lrem('faucetQueue',-1,address)
    console.log("removeFromQueue")
    console.log(removeFromQueue);
} catch (err) {
        console.error('isOverLimit: could not increment key')
        throw err
    }

}

function runner() {
    setInterval(async function() {

        let faucetQueue
        faucetQueue = await getFaucetQueue();

        if (faucetQueue.length > 0) {
            try {
                let [wallet, addr] = await MnemonicWalletWithPassphrase(mnemonic);
                let outputs = [];

                faucetQueue.forEach(receiver => outputs.push({
                    address: trimWhiteSpaces(receiver),
                    coins: [{
                        denom: config.DENOM,
                        amount: config.AMOUNT,
                    }, ],
                }));
                const msgs = msg(addr, outputs);
                await processTransaction(wallet,addr,msgs)

            } catch (e) {
                console.log("Transaction Failed: ", e);
            }
        } else {
            console.log("No Accounts to faucet");
            console.log(config.faucetQueue);
        }
    }, 3000);
}

function secondsToHms(d) {
    d = Number(d);
    let h = Math.floor(d / 3600);
    let m = Math.floor(d % 3600 / 60);
    let s = Math.floor(d % 3600 % 60);

    let hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours ") : "";
    let mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes ") : "";
    let sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return hDisplay + mDisplay + sDisplay;
}

async function handleFaucetRequest(req) {
    let userAddress = req.body.address
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress

    try {
        let ipCount
        try {
            ipCount = await client.incr(ip)
        } catch (err) {
            console.error('ipCount: could not increment key')
            throw err
        }
        console.log(`${ip} has value: ${ipCount}`)

        if (ipCount > config.MAX_PER_IP) {
            console.log("Ip is over limits")
            client.expire(ip, config.TIME_LIMIT)
            return JSON.stringify({
                status: "error",
                message: "You have requested " + ipCount + " times. The limit  " + config.MAX_PER_IP + " per " + secondsToHms(config.TIME_LIMIT) + ""
            });
        } else {
            let accountResponse
            accountResponse = await validateAccount(userAddress);

            // If we get any code then report it, except 5 which means no account exist which is fine to send to a new account.
            if (accountResponse.code && accountResponse.code !== 5) {
                return JSON.stringify({
                    status: "error",
                    message: accountResponse.message
                });
            }else if (ipCount < config.MAX_PER_IP) {
                await addToQueue(userAddress);
                return JSON.stringify({
                    status: "success",
                    message: "Success, your address will receive funds shortly"
                });
            } else {
                console.log("error")
                console.log(accountResponse);
                return JSON.stringify({status: "error", message: "Your account cannot get funds at this time. "
                });
            }
        }
    } catch (e) {
        console.log(e);
        return JSON.stringify({
            status: "error",
            message: e.toString()
        });
    }

}

async function getQueue() {
    let getQueue
    getQueue = await getFaucetQueue();
    console.log(getQueue)
    return getQueue;
}

module.exports = {
    runner, 
    handleFaucetRequest,
    MnemonicWalletWithPassphrase,
    processTransaction,
    getQueue
};

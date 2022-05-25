require("dotenv").config();
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const constants = require("./constants");
const {
    Secp256k1HdWallet
} = require("@cosmjs/amino");
const {
    SigningStargateClient,
    GasPrice
} = require("@cosmjs/stargate");
const {
    stringToPath
} = require("@cosmjs/crypto");
const restAPI = process.env.BLOCKCHAIN_REST_SERVER;
const rpc = process.env.RPC;
const mnemonic = process.env.FAUCET_MNEMONIC;
const msgSendTypeUrl = "/cosmos.bank.v1beta1.MsgMultiSend";
const {
    MsgMultiSend,
    fromPartial
} = require("cosmjs-types/cosmos/bank/v1beta1/tx");



const redis = require('ioredis')
const client = redis.createClient({
    port: process.env.REDIS_PORT || 6379,
    host: process.env.REDIS_HOST || 'localhost',
})
client.on('connect', function() {
    console.log('connected');
});


function trimWhiteSpaces(data) {
    return data.split(' ').join('');
}

function msg(inputs, outputs) {
    return {
        typeUrl: msgSendTypeUrl,
        value: MsgMultiSend.fromPartial({
            inputs: [{
                address: trimWhiteSpaces(inputs), //fromAddress
                coins: [{
                    denom: constants.DENOM,
                    amount: (outputs.length * parseInt(constants.AMOUNT)).toString(),
                }, ],
            }, ],
            outputs: outputs, //toAddress
        }),
    }
}

async function Transaction(wallet, signerAddress, msgs, fee, memo = '') {
    const cosmJS = await SigningStargateClient.connectWithSigner(rpc, wallet);
    return await cosmJS.signAndBroadcast(signerAddress, msgs, fee, memo); //DeliverTxResponse, 0 iff success
}

async function MnemonicWalletWithPassphrase(mnemonic) {
    const wallet = await Secp256k1HdWallet.fromMnemonic(mnemonic, {
        prefix: constants.prefix,
        bip39Password: '',
        hdPaths: [stringToPath(constants.HD_PATH)]
    });
    const [firstAccount] = await wallet.getAccounts();
    return [wallet, firstAccount.address];

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
        try {
            faucetQueue = await client.lrange('faucetQueue',0, -1)
            console.log("Getting Faucet Queue")
            console.log(faucetQueue);
        } catch (err) {
            console.error('isOverLimit: could not increment key')
            throw err
        }

        if (faucetQueue.length > 0) {
            try {
                let [wallet, addr] = await MnemonicWalletWithPassphrase(mnemonic);
                let outputs = [];

                faucetQueue.forEach(receiver => outputs.push({
                    address: trimWhiteSpaces(receiver),
                    coins: [{
                        denom: constants.DENOM,
                        amount: constants.AMOUNT,
                    }, ],
                }));
                const msgs = msg(addr, outputs);
                const response = await Transaction(
                    wallet,
                    addr,
                    [msgs], {
                        "amount": [{
                            amount: (parseInt(constants.gas) * GasPrice.fromString(constants.gas_price).amount).toString(),
                            denom: constants.DENOM
                        }],
                        "gas": constants.gas
                    },
                    "Thanks for using Osmosis Faucet"
                );
                faucetQueue.forEach(function(address) {
                    removeFromQueue(address)
                })


            } catch (e) {
                console.log("Transaction Failed: ", e);
            }
        } else {
            console.log("No Accounts to faucet");
            console.log(constants.faucetQueue);
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
            console.error('isOverLimit: could not increment key')
            throw err
        }
        console.log(`${ip} has value: ${ipCount}`)

        if (ipCount > constants.MAX_PER_IP) {
            console.log("OVERLIMIT!")
            client.expire(ip, constants.TIME_LIMIT)
            return JSON.stringify({
                status: "error",
                message: "You have requested " + ipCount + " times. The limit  " + constants.MAX_PER_IP + " per " + secondsToHms(constants.TIME_LIMIT) + ""
            });
        } else {
            // Validate account
            let xmlHttp = new XMLHttpRequest();
            xmlHttp.open("GET", restAPI + "/cosmos/auth/v1beta1/accounts/" + userAddress, false); // false for synchronous request
            xmlHttp.send(null);
            const accountResponse = JSON.parse(xmlHttp.responseText);

            console.log("Account Validation Response")
            console.log(accountResponse)

            if (accountResponse.code) {
                console.log(accountResponse);
                return JSON.stringify({
                    status: "error",
                    message: accountResponse.message
                });
            }else if (ipCount < constants.MAX_PER_IP) {
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
            message: "Invalid address."
        });
    }

}

module.exports = {
    runner,
    handleFaucetRequest,
    MnemonicWalletWithPassphrase,
    Transaction
};

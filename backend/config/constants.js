
const FAUCET_QUEUE_LIMIT = 15;
const AMOUNT = "500000000";
const DENOM = "uosmo";
const CHAIN_ID = "osmo-testnet-4";
let faucetQueue=[];
const prefix= "osmo";
const gas_price = "0uosmo";
const gas = "500000";
const TIME_LIMIT = 3600 * 2; // 3600 seconds x 2 = 2 hours
const MAX_PER_IP = 2;
const MAX_VOTE_PER_IP = 20;
const HD_PATH = "m/44'/118'/0'/0/0";
module.exports = {
    FAUCET_QUEUE_LIMIT,
    AMOUNT,
    DENOM,
    CHAIN_ID,
    faucetQueue,
    prefix,
    gas_price,
    gas,
    TIME_LIMIT,
    MAX_PER_IP,
    MAX_VOTE_PER_IP,
    HD_PATH
}


const FAUCET_QUEUE_LIMIT = 15;
const AMOUNT = "100000000";
const DENOM = "uosmo";
const CHAIN_ID = "v13.0.0-rc3-testnet";
let faucetQueue=[];
const prefix= "osmo";
const gas_price = "0.025uosmo";
const gas = "20000000";
const TIME_LIMIT = 3600 * 2; // 3600 seconds x 2 = 2 hours
const MAX_PER_IP = 100;
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

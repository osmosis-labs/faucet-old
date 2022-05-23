
const FAUCET_LIST_LIMIT = 15;
const AMOUNT = "1";
const DENOM = "uosmo";
const CHAIN_ID = "osmo-testnet-4";
let FaucetList=[];
const prefix= "osmo";
const gas_price = "0uosmo";
const gas = "500000";
const IP_WINDOW = 24 * 60 * 60 * 1000;
const IP_DRIP_LIMIT = 10;
const HD_PATH = "m/44'/118'/0'/0/0";
module.exports = {
    FAUCET_LIST_LIMIT,
    AMOUNT,
    DENOM,
    CHAIN_ID,
    FaucetList,
    prefix,
    gas_price,
    gas,
    IP_WINDOW,
    IP_DRIP_LIMIT,
    HD_PATH
}
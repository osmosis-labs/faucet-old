require("dotenv").config();

// ----------------------------------------------------------------
// Environment variables
// ----------------------------------------------------------------

// Port where this backend should run
const port = process.env.PORT || 8080;

// Mnemonic of the Faucet
const mnemonic = process.env.FAUCET_MNEMONIC;

// Endpoint used for rest queries
const restEndpoint = process.env.REST_ENDPOINT || "https://lcd-test.osmosis.zone";

// Endpoint used for rpc queries
const rpcEndpoint = process.env.RPC_ENDPOINT || "https://rpc-test.osmosis.zone";

// Host and port of redis 
const redisPort = process.env.REDIS_PORT || 6379
const redisHost = process.env.REDIS_HOST || 'localhost'

// ----------------------------------------------------------------
// Faucet backend parameters 
// ----------------------------------------------------------------

const FAUCET_QUEUE_LIMIT = 15;
const AMOUNT = "1";
const DENOM = "uosmo";
const CHAIN_ID = "osmo-testnet-4";
let faucetQueue=[];
const prefix= "osmo";
const gas_price = "0uosmo";
const gas = "500000";
const TIME_LIMIT = 3600 * 2; // 3600 seconds x 2 = 2 hours
const MAX_PER_IP = 10;
const MAX_VOTE_PER_IP = 20;
const HD_PATH = "m/44'/118'/0'/0/0";

module.exports = {
    port,
    mnemonic,
    restEndpoint,
    rpcEndpoint,
    redisPort,
    redisHost,
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

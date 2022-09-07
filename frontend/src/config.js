// Defaults values for the configuration
const DEFAULT_RPC_ENDPOINT = "https://rpc-test.osmosis.zone";
const DEFAULT_REST_ENDPOINT = "https://lcd-test.osmosis.zone";
const DEFAULT_CHAIN_ID = "osmo-test-4";
const DEFAULT_FAUCET_BACKEND = "https://testnet-faucet.dev-osmosis.zone";

// Overwrite default values with environment variables
export const config = {
    RPC_ENDPOINT: import.meta.env.VITE_RPC_ENDPOINT ? import.meta.env.VITE_RPC_ENDPOINT : DEFAULT_RPC_ENDPOINT,
    REST_ENDPOINT: import.meta.env.VITE_REST_ENDPOINT ? import.meta.env.VITE_REST_ENDPOINT : DEFAULT_REST_ENDPOINT,
    CHAIN_ID: import.meta.env.VITE_CHAIN_ID ? import.meta.env.VITE_CHAIN_ID : DEFAULT_CHAIN_ID,
    FAUCET_BACKEND: import.meta.env.VITE_FAUCET_BACKEND ? import.meta.env.VITE_FAUCET_BACKEND : DEFAULT_FAUCET_BACKEND,
};

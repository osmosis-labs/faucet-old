import { defineStore } from 'pinia'

// main is the name of the store. It is unique across your application
// and will appear in devtools
export const usekeplrStore = defineStore('keplr', {
    // a function that returns a fresh state

    state: () => ({
        isNetworkAdded: false,
        chainId: 'v13.0.0-rc3-testnet',
        rpcEndpoint: 'https://rpc-test.osmosis.zone',
        address: null,
        resultTx: '',
        isTestnet: true,

    }),

    // optional getters
    getters: {

    },
    // optional actions
    actions: {

    },
})

import { defineStore } from 'pinia'

// main is the name of the store. It is unique across your application
// and will appear in devtools
export const usekeplrStore = defineStore('keplr', {
    // a function that returns a fresh state

    state: () => ({
        isNetworkAdded: false,
        chainId: 'osmo-test-4',
        rpcEndpoint: 'https://rpc-test.osmosis.zone',
        address: null,
        resultTx: '',
    }),

    // optional getters
    getters: {

    },
    // optional actions
    actions: {

    },
})

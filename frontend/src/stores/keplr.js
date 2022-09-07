import { defineStore } from 'pinia'
import { config } from '@/config'

// main is the name of the store. It is unique across your application
// and will appear in devtools
export const usekeplrStore = defineStore('keplr', {
    // a function that returns a fresh state

    state: () => ({
        isNetworkAdded: false,
        chainId: config.CHAIN_ID,
        rpcEndpoint: config.RPC_ENDPOINT,
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

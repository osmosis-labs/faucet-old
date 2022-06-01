import { defineStore } from 'pinia'

// main is the name of the store. It is unique across your application
// and will appear in devtools
export const useContractStore = defineStore('contract', {

    state: () => ({
        wallet: {
            address: "No address generated",
            mnemonic: "No address generated",

        },
        contracts:[],
    }),

    // optional getters
    getters: {

    },
    // optional actions
    actions: {

    },
})

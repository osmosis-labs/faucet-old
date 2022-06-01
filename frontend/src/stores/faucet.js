import { defineStore } from 'pinia'

// main is the name of the store. It is unique across your application
// and will appear in devtools
export const useFaucetStore = defineStore('faucet', {
    state: () => ({
        form: {
            formName: "Osmosis testnet faucet",
            endpoint: window.FAUCET_SERVER ? window.FAUCET_SERVER : import.meta.env.VITE_FAUCET_SERVER,
            payload: {
                mnemonic: "",
                address: "",
                animate: false
            }
        },
        wallet: {
            address: "No address generated",
            mnemonic: "No address generated",

        },
        queue: {
            list: {},
            loading: false,
        },
        alert: {
            faucet: {
                show: false,
                status: "",
                message: ""
            },
            wallet: {
                show: false,
                status: "",
                message: ""
            }
        }
    }),

    // optional getters
    getters: {

    },
    // optional actions
    actions: {

    },
})

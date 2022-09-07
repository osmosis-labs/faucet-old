import { defineStore } from 'pinia'

// main is the name of the store. It is unique across your application
// and will appear in devtools
export const useFaucetStore = defineStore('faucet', {

    state: () => ({
        form: {
            formName: "Osmosis testnet faucet",
            endpoint: window.FAUCET_BACKEND ? window.FAUCET_BACKEND : import.meta.env.VITE_FAUCET_BACKEND,
            payload: {
                mnemonic: "",
                address: "",
                animate: false,
                code_id: "",
            },
            VoteOptionSelected: 'Yes',
            VoteOptions: [
                { value: 'Yes', text: 'VOTE YES' },
                { value: 'No', text: 'VOTE NO' },
                { value: 'Veto', text: 'VOTE NO WITH VETO'}
              ]
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
            vote: {
                show: false,
                status: "",
                message: ""
            },
            wallet: {
                show: false,
                status: "",
                message: ""
            }
        },
        txs: {
            currentPage:1,
            total_count:null,
            per_page:30,
            pages:null,
            list: []
        }
    }),

    // optional getters
    getters: {

    },
    // optional actions
    actions: {

    },
})

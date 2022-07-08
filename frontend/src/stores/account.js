import { defineStore } from 'pinia'

export const useAccountStore = defineStore('account', {

    state: () => ({
        blockchainAssets:null,
        assetlist:null,
        mergedAssets: [],
        account:[],
        bank: null,
        txs: {
            currentPage:1,
            total_count:null,
            per_page:30,
            pages:null,
            list: []
        }
    }),

});

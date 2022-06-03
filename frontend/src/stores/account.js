import { defineStore } from 'pinia'

export const useAccountStore = defineStore('account', {

    state: () => ({
        blockchainAssets:null,
        assetlist:null,
        mergedAssets: [],
        account:[],
        bank: null
    }),

});

import { defineStore } from 'pinia'

export const useContractStore = defineStore('contract', {

    state: () => ({
        contracts:[],
    }),

});

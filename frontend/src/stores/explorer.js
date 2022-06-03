import { defineStore } from 'pinia'

export const useExplorerStore = defineStore('explorer', {

    state: () => ({
        search: {
            address: null,
            error: null
        },
    }),

});

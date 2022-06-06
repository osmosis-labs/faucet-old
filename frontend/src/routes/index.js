import { createWebHashHistory, createRouter } from "vue-router";
import Faucet from '@/components/Faucet.vue'
import Keplr from '@/components/Keplr.vue'
import Wallet from '@/components/Wallet.vue'
import Contracts from '@/components/Contracts.vue'
import Explorer from '@/components/Explorer.vue'
import Account from '@/components/Account.vue'
import NotFound from '@/components/NotFound.vue'


const routes = [
    {
        path: "/",
        name: "Faucet",
        component: Faucet,
    },
    {
        path: "/keplr",
        name: "Keplr",
        component: Keplr,
    },
    {
        path: "/wallet",
        name: "Wallet",
        component: Wallet,
    },
    {
        path: "/contracts",
        name: "Contracts",
        component: Contracts,
    },
    {
        path: "/explorer",
        name: "Explorer",
        component: Explorer,
    },
    {
        path: '/account/:address',
        component: Account,
        children: [
            {
                // UserProfile will be rendered inside User's <router-view>
                // when /user/:id/profile is matched
                path: 'tx',
                component: Account,
            },
            {
                // UserPosts will be rendered inside User's <router-view>
                // when /user/:id/posts is matched
                path: 'coins',
                component: Account,
            },
        ],
    },
];


const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;

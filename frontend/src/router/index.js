import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Statistic from '../views/Statistic.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/statistic',
        name: 'Statistic',
        component: Statistic
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/'
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router

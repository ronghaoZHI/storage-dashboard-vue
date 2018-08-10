import Vue from 'vue'
import Router from 'vue-router'
import routes from './routerItem'
import iView from 'iview-bsc'
import store from '@/store'

Vue.use(Router)

const router = new Router({ routes })

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start()
    if (to.matched.some(record => record.meta.requiresAuth)) {
        store.state.token ? next(!from.name && !to.name ? {
            path: store.state.user.type === 'sub' ? '/bucket' : '/overview'
        } : {}) : next({
            path: window.dashboard_conf.onlineMode === 'True' ? '/bridge' : '/login',
            ticket: { redirect: to.fullPath }
        })
    } else {
        next()
    }
})

router.afterEach((to, from, next) => {
    iView.LoadingBar.finish()
})

export default router

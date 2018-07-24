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
        // check role
        if (_.some(store.getters.menuList, { 'name': to.name || 'overview', 'meta': { 'show': true } })) {
            store.state.token ? next() : next({
                path: window.dashboard_conf.onlineMode === 'True' ? '/bridge' : '/login',
                ticket: { redirect: to.fullPath }
            })
        } else {
            iView.Message.error({
                content: '当前账户没有访问此功能的权限',
                duration: 5,
                closable: true,
            })
            iView.LoadingBar.finish()
        }
    } else {
        next()
    }
})

router.afterEach((to, from, next) => {
    iView.LoadingBar.finish()
})

export default router

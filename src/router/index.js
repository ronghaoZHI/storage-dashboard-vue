import Vue from 'vue'
import Router from 'vue-router'
import routes from './routerItem'
import iView from 'iview-bsc'
import store from '@/store'

Vue.use(Router)

const router = new Router({ routes })

const redirectToLogin = async (to, next) => {
    await this.$store.dispatch('cleanState')
    next({
        path: window.dashboard_conf.onlineMode === 'True' ? '/bridge' : '/login',
        ticket: { redirect: to.fullPath }
    })
}

const hasPermission = (to) => {
    const router = {
        // check the type of this router
        name: to.meta && to.meta.parent ? to.meta.parent : to.name || 'overview',
        meta: { 'show': true }
    }
    return _.some(store.getters.menuList, router)
}

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start()
    if (to.matched.some(record => record.meta.requiresAuth)) {
        // check role
        if (hasPermission) {
            store.state.token ? next(!from.name && !to.name ? {
                path: store.state.user.type === 'sub' ? '/bucket' : '/overview'
            } : {}) : redirectToLogin(to, next)
        } else {
            iView.Message.error({
                content: '当前账户没有访问此功能的权限',
                duration: 10,
                closable: true,
                render: h => {
                    return h('a', {
                        on: {
                            click: () => redirectToLogin(to, next),
                        },
                    }, '重新登录')
                }
            })
            iView.LoadingBar.finish()
        }
    } else {
        next()
    }
})

router.afterEach((to, from, next) => {
    iView.LoadingBar.finish()
    iView.Message.destroy()
})

export default router

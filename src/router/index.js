import Vue from 'vue'
import Router from 'vue-router'
import routes from './routerItem'
import User from '../store/modules/user'
import iView from 'iview'

Vue.use(Router)

const router = new Router({ routes })

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start()
    if (to.matched.some(record => record.meta.requiresAuth)) {
        User.state.username ? next() : next({
            path: '/login',
            query: { redirect: to.fullPath }
        })
    } else {
        next()
    }
})

router.afterEach((to, from, next) => {
    iView.LoadingBar.finish()
})

export default router
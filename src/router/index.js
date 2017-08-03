import Vue from 'vue'
import Router from 'vue-router'
import routes from './routerItem'
import iView from 'iview'

Vue.use(Router)

const router = new Router({ routes })

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start()
    if (to.matched.some(record => record.meta.requiresAuth)) {
        next()
    } else {
        next()
    }
})

router.afterEach((to, from, next) => {
    iView.LoadingBar.finish()
})

export default router

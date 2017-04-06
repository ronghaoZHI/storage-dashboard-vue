import Vue from 'vue'
import Router from 'vue-router'
import User from '../store/modules/user'
import iView from 'iview'
import { getUserInfoData } from '../components/service/Data'
import Layout from '@/components/common/Layout'
import Bucket from '@/components/bucket/Bucket'
import File from '@/components/bucket/File'
import Dashboard from '@/components/dashboard/Dashboard'
import Keychain from '@/components/keychain/Keychain'
import Login from '@/components/login/Login'

Vue.use(Router);

const router = new Router({
    routes: [{
        path: '/',
        component: Layout,
        meta: { requiresAuth: true },
        children: [{
            path: '',
            redirect: '/bucket'
        }, {
            path: '/bucket',
            name: 'bucket',
            meta: { title: 'My storage' },
            component: Bucket
        }, {
            path: '/bucket/:bucket/prefix/:prefix',
            name: 'file',
            meta: { title: 'My storage' },
            component: File
        }, {
            path: '/dashboard',
            name: 'dashboard',
            meta: { title: 'Dashboard' },
            component: Dashboard,
        }, {
            path: '/keychain',
            name: 'keychain',
            meta: { title: 'Keychain' },
            component: Keychain,
        }]
    }, {
        path: '/login',
        component: Login
    }]
});

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (User.state.login) {
            next()
        } else if (isServerLogin) {
            next()
        } else {
            next({
                path: '/login',
                query: { redirect: to.fullPath }
            })
        }
    } else {
        next()
    }
})

router.afterEach((to, from, next) => {
    iView.LoadingBar.finish();
})

// when the user refresh the page, the server has login state 
const isServerLogin = async() => {
    let info = await getUserInfoData()
    return info.username ? true : false
}

export default router;
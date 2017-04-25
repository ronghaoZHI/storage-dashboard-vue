import Vue from 'vue'
import Router from 'vue-router'
import User from '../store/modules/user'
import iView from 'iview'
import Layout from '@/components/common/Layout'
import Bucket from '@/components/bucket/Bucket'
import File from '@/components/bucket/File'
import Upload from '@/components/bucket/Upload'
import Dashboard from '@/components/dashboard/Dashboard'
import Keychain from '@/components/keychain/Keychain'
import Login from '@/components/login/Login'
import Settings from '@/components/bucket/Settings'
import FilePermissions from '@/components/bucket/FilePermissions'

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
            meta: { title: 'My storage', ali: 'bucket' },
            component: Bucket
        }, {
            path: '/bucket/:bucket/prefix/:prefix',
            name: 'file',
            meta: { title: 'My storage', ali: 'bucket' },
            component: File
        }, {
            path: '/upload/:bucket/prefix/:prefix',
            name: 'upload',
            meta: { title: 'My storage', ali: 'bucket' },
            component: Upload,
        }, {
            path: '/dashboard',
            name: 'dashboard',
            meta: { title: 'Dashboard', ali: 'dashboard' },
            component: Dashboard,
        }, {
            path: '/keychain',
            name: 'keychain',
            meta: { title: 'Keychain', ali: 'keychain' },
            component: Keychain,
        }, {
            path: '/bucket/:bucket/bucketSettings',
            name: 'bucketSettings',
            meta: { title: 'Bucket Settings' },
            component: Settings
        }, {
            path: '/bucket/:bucket/prefix/:prefix/key/:key/FilePermissions',
            name: 'FilePermissions',
            meta: { title: 'File Permissions' },
            component: FilePermissions
        }]
    }, {
        path: '/login',
        component: Login
    }]
});

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (User.state.username) {
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

export default router;
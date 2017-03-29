import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/components/common/Layout'
import Bucket from '@/components/bucket/Bucket'
import File from '@/components/bucket/File'
import Dashboard from '@/components/dashboard/Dashboard'
import Keychain from '@/components/keychain/Keychain'
import Login from '@/components/login/Login'

Vue.use(Router);

export default new Router({
    routes: [{
        path: '/',
        component: Layout,
        children: [{
                path: '',
                redirect: '/bucket'
            }, {
                path: '/bucket',
                name: 'bucket',
                component: Bucket
            },
            {
                path: '/file/:bucket',
                name: 'file',
                component: File
            }, {
                path: '/dashboard',
                name: 'dashboard',
                component: Dashboard,
            }, {
                path: '/keychain',
                name: 'keychain',
                component: Keychain,
            }
        ]
    }, {
        path: '/login',
        component: Login
    }]
});
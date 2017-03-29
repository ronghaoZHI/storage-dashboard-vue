import Vue from 'vue'
import Router from 'vue-router'
import Bucket from '@/components/bucket/Bucket'
import File from '@/components/bucket/File'
import Dashboard from '@/components/dashboard/Dashboard'
import Keychain from '@/components/keychain/Keychain'

Vue.use(Router);

export default new Router({
    routes: [{
            path: '/',
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
});
import Layout from '@/components/common/layout'
import Bucket from '@/components/bucket/Bucket'
import File from '@/components/bucket/File'
import Upload from '@/components/bucket/Upload'
import Dashboard from '@/components/dashboard/Dashboard'
import Machine from '@/components/machine/Machine'
import Keychain from '@/components/keychain/Keychain'
import Login from '@/components/login/Login'
import Settings from '@/components/bucket/Settings'
import FilePermissions from '@/components/bucket/FilePermissions'

const layoutChild = [{
    path: '',
    redirect: '/bucket'
}, {
    path: '/bucket',
    name: 'bucket',
    meta: { title: 'My storage', ali: 'bucket' }, //'ali' => Menu.vue
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
    meta: { title: 'Bucket Settings', ali: 'bucket' },
    component: Settings
}, {
    path: '/bucket/:bucket/prefix/:prefix/key/:key/FilePermissions',
    name: 'FilePermissions',
    meta: { title: 'File Permissions', ali: 'bucket' },
    component: FilePermissions
}, {
    path: '/machine',
    name: 'machine',
    meta: { title: 'Machine', ali: 'machine' },
    component: Machine,
}, {
    path: '/partition',
    name: 'partition',
    meta: { title: 'Partition', ali: 'partition' },
    component: Keychain,
}]

const routes = [{
    path: '/',
    component: Layout,
    meta: { requiresAuth: true },
    children: layoutChild
}, {
    path: '/login',
    component: Login
}]

export default routes
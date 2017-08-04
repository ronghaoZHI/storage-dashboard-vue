import Layout from '@/components/layout'
import Bucket from '@/pages/bucket/Bucket'
import File from '@/pages/bucket/File'
import Dashboard from '@/pages/dashboard/Dashboard'
import Machine from '@/pages/machine/Machine'
import Keychain from '@/pages/keychain/Keychain'
import UserManage from '@/pages/user/UserManage'
import Login from '@/pages/login/Login'
import Settings from '@/pages/bucket/Settings'
import PictureStyles from '@/pages/bucket/PictureStyles'
import EditStyles from '@/pages/bucket/EditStyles'
import FilePermissions from '@/pages/bucket/FilePermissions'
import user from '@/store/modules/user'
import TemplateList from '@/pages/video/TemplateList'
import TemplateEdit from '@/pages/video/TemplateEdit'
import OutputList from '@/pages/video/OutputList'
import OutputEdit from '@/pages/video/OutputEdit'
import JobList from '@/pages/video/JobList'
import JobEdit from '@/pages/video/JobEdit'
import Notfound from '@/pages/404/404'
import Bridge from '@/pages/bridge/bridge'

const layoutChild = [{
    path: '',
    redirect: user.state.type === 'admin' && !user.state.subUser ? '/user' : '/bucket'
}, {
    path: '/bucket',
    name: 'bucket',
    meta: { title: 'My storage', ali: 'bucket' }, // 'ali' => Menu.vue
    component: Bucket
}, {
    path: '/bucket/:bucket/prefix/:prefix',
    name: 'file',
    meta: { title: 'My storage', ali: 'bucket' },
    component: File
}, {
    path: '/dashboard',
    name: 'dashboard',
    meta: { title: 'Dashboard', ali: 'dashboard' },
    component: Dashboard
}, {
    path: '/keychain',
    name: 'keychain',
    meta: { title: 'Keychain', ali: 'keychain' },
    component: Keychain
}, {
    path: '/bucket/:bucket/bucketSettings',
    name: 'bucketSettings',
    meta: { title: 'Bucket Settings', ali: 'bucket' },
    component: Settings
}, {
    path: '/bucket/:bucket/pictureStyles',
    name: 'pictureStyles',
    meta: { title: 'Picture Styles', ali: 'bucket' },
    component: PictureStyles
}, {
    path: '/bucket/:bucket/pictureStyles/editStyles/ruleName/:ruleName/IS/:IS',
    name: 'editStyles',
    meta: { title: 'Edit Styles', ali: 'bucket' },
    component: EditStyles
}, {
    path: '/bucket/:bucket/prefix/:prefix/key/:key/FilePermissions',
    name: 'FilePermissions',
    meta: { title: 'File Permissions', ali: 'bucket' },
    component: FilePermissions
}, {
    path: '/video/template',
    name: 'template',
    meta: { title: 'Video', ali: 'template', parent: 'video' },
    component: TemplateList
}, {
    path: '/video/templateEdit/id/:id',
    name: 'TemplateEdit',
    meta: { title: 'Video', ali: 'template', parent: 'video' },
    component: TemplateEdit
}, {
    path: '/video/output',
    name: 'output',
    meta: { title: 'Video', ali: 'output', parent: 'video' },
    component: OutputList
}, {
    path: '/video/outputEdit/bucket/:bucket/id/:id',
    name: 'outputEdit',
    meta: { title: 'Video', ali: 'output', parent: 'video' },
    component: OutputEdit
}, {
    path: '/video/JobList',
    name: 'job',
    meta: { title: 'Video', ali: 'job', parent: 'video' },
    component: JobList
}, {
    path: '/video/JobEdit',
    name: 'jobEdit',
    meta: { title: 'Video', ali: 'job', parent: 'video' },
    component: JobEdit
}, {
    path: '/machine',
    name: 'machine',
    meta: { title: 'Machine', ali: 'machine' },
    component: Machine
}, {
    path: '/user',
    name: 'user',
    meta: { title: 'User', ali: 'user' },
    component: UserManage
}]

const routes = [{
    path: '/',
    component: Layout,
    meta: { requiresAuth: true },
    children: layoutChild
}, {
    path: '/login',
    component: Login
}, {
    path: '',
    component: Bridge
}, {
    path: '/bridge',
    component: Bridge
}, {
    path: '*',
    component: Notfound
}]

export default routes

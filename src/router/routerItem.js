import Layout from '@/components/layout'
import Bucket from '@/pages/bucket/Bucket'
import File from '@/pages/bucket/File'
import Dashboard from '@/pages/dashboard/Dashboard'
import Machine from '@/pages/system/Machine'
import Group from '@/pages/system/Group'
import Partition from '@/pages/system/Partition'
import Traffic from '@/pages/system/Traffic'
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
import Bridge from '@/pages/bridge/Bridge'
import Upgrade from '@/pages/upgrade/Upgrade'
import DataStatistics from '@/pages/video/DataStatistics'
import PipelineList from '@/pages/video/PipelineList'
import PipelineEdit from '@/pages/video/PipelineEdit'

const layoutChild = [{
    path: '',
    redirect: user.state.type === 'admin' && !user.state.subUser ? '/user' : '/bucket'
}, {
    path: '/bucket',
    name: 'bucket',
    meta: { title: 'My storage', ali: 'bucket' }, // 'ali' => Menu.vue
    component: Bucket
}, {
    path: '/bucket/:bucket',
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
    path: '/bucket/:bucket/bucketSettings/tabName/:tabName',
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
    path: '/video/pipeline',
    name: 'pipeline',
    meta: { title: 'Video', ali: 'pipeline', parent: 'video' },
    component: PipelineList
}, {
    path: '/video/pipelineEdit/id/:id',
    name: 'pipelineEdit',
    meta: { title: 'Video', ali: 'pipeline', parent: 'video' },
    component: PipelineEdit
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
    path: '/video/JobEdit/id/:id',
    name: 'jobEdit',
    meta: { title: 'Video', ali: 'job', parent: 'video' },
    component: JobEdit
}, {
    path: '/video/statistics',
    name: 'statistics',
    meta: { title: 'Video', ali: 'statistics', parent: 'video' },
    component: DataStatistics
}, {
    path: '/system/machine',
    name: 'machine',
    meta: { title: 'Machine', ali: 'machine' },
    component: Machine
}, {
    path: '/system/group',
    name: 'group',
    meta: { title: 'Group', ali: 'group' },
    component: Group
}, {
    path: '/system/partition',
    name: 'partition',
    meta: { title: 'Partition', ali: 'partition' },
    component: Partition
}, {
    path: '/system/traffic',
    name: 'traffic',
    meta: { title: 'Traffic', ali: 'Traffic' },
    component: Traffic
}, {
    path: '/user',
    name: 'user',
    meta: { title: 'User', ali: 'user' },
    component: UserManage
}]

let upgradeMode = {
    path: '*',
    component: Upgrade
}

const routes = window.dashboard_conf.upgradeMode === 'True' ? [upgradeMode] : [{
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

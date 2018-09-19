const layoutChild = [
  {
    path: '/overview',
    name: 'overview',
    meta: { title: 'Overview', ali: 'overview' }, // 'ali' => Menu.vue
    component: () => import('@/pages/overview/Overview'),
  },
  {
    path: '/bucket',
    name: 'bucket',
    meta: { title: 'My storage', ali: 'bucket' },
    component: () => import('@/pages/bucket/Bucket'),
  },
  {
    path: '/bucket/:bucket',
    name: 'bucket',
    meta: { title: 'My storage', ali: 'bucket' }, // 'ali' => Menu.vue
    component: () => import('@/pages/bucket/Bucket'),
  },
  {
    path: '/bucket/:bucket/prefix/:prefix',
    name: 'file',
    meta: { title: 'My storage', ali: 'bucket' },
    component: () => import('@/pages/bucket/File'),
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    meta: { title: 'Dashboard', ali: 'dashboard' },
    component: () => import('@/pages/dashboard/Dashboard'),
  },
  {
    path: '/keychain',
    name: 'keychain',
    meta: { title: 'Keychain', ali: 'keychain' },
    component: () => import('@/pages/keychain/Keychain'),
  },
  {
    path: '/bucket/:bucket/bucketSettings/tabName/:tabName',
    name: 'bucketSettings',
    meta: { title: 'Bucket Settings', ali: 'bucket' },
    component: () => import('@/pages/bucket/Settings'),
  },
  {
    path: '/bucket/:bucket/pictureStyles',
    name: 'pictureStyles',
    meta: { title: 'Picture Styles', ali: 'bucket' },
    component: () => import('@/pages/bucket/PictureStyles'),
  },
  {
    path: '/bucket/:bucket/pictureStyles/editStyles/ruleName/:ruleName/IS/:IS',
    name: 'editStyles',
    meta: { title: 'Edit Styles', ali: 'bucket' },
    component: () => import('@/pages/bucket/EditStyles'),
  },
  {
    path: '/bucket/:bucket/prefix/:prefix/key/:key/FilePermissions',
    name: 'FilePermissions',
    meta: { title: 'File Permissions', ali: 'bucket' },
    component: () => import('@/pages/bucket/FilePermissions'),
  },
  {
    path: '/video/template',
    name: 'template',
    meta: { title: 'Video', ali: 'template', parent: 'video' },
    component: () => import('@/pages/video/TemplateList'),
  },
  {
    path: '/video/templateEdit/id/:id',
    name: 'TemplateEdit',
    meta: { title: 'Video', ali: 'template', parent: 'video' },
    component: () => import('@/pages/video/TemplateEdit'),
  },
  {
    path: '/video/pipeline',
    name: 'pipeline',
    meta: { title: 'Video', ali: 'pipeline', parent: 'video' },
    component: () => import('@/pages/video/PipelineList'),
  },
  {
    path: '/video/pipelineEdit/id/:id',
    name: 'pipelineEdit',
    meta: { title: 'Video', ali: 'pipeline', parent: 'video' },
    component: () => import('@/pages/video/PipelineEdit'),
  },
  {
    path: '/video/output',
    name: 'output',
    meta: { title: 'Video', ali: 'output', parent: 'video' },
    component: () => import('@/pages/video/OutputList'),
  },
  {
    path: '/video/outputEdit/bucket/:bucket/id/:id',
    name: 'outputEdit',
    meta: { title: 'Video', ali: 'output', parent: 'video' },
    component: () => import('@/pages/video/OutputEdit'),
  },
  {
    path: '/video/JobList',
    name: 'job',
    meta: { title: 'Video', ali: 'job', parent: 'video' },
    component: () => import('@/pages/video/JobList'),
  },
  {
    path: '/video/JobEdit/id/:id',
    name: 'jobEdit',
    meta: { title: 'Video', ali: 'job', parent: 'video' },
    component: () => import('@/pages/video/JobEdit'),
  },
  {
    path: '/video/statistics',
    name: 'statistics',
    meta: { title: 'Video', ali: 'statistics', parent: 'video' },
    component: () => import('@/pages/video/DataStatistics'),
  },
  {
    path: '/system/machine',
    name: 'machine',
    meta: { title: 'Machine', ali: 'machine', parent: 'system' },
    component: () => import('@/pages/system/Machine'),
  },
  {
    path: '/system/group',
    name: 'group',
    meta: { title: 'Group', ali: 'group', parent: 'system' },
    component: () => import('@/pages/system/Group'),
  },
  {
    path: '/system/partition',
    name: 'partition',
    meta: { title: 'Partition', ali: 'partition', parent: 'system' },
    component: () => import('@/pages/system/Partition'),
  },
  {
    path: '/system/traffic',
    name: 'traffic',
    meta: { title: 'Traffic', ali: 'Traffic', parent: 'system' },
    component: () => import('@/pages/system/Traffic'),
  },
  {
    path: '/user',
    name: 'user',
    meta: { title: 'User', ali: 'user' },
    component: () => import('@/pages/user/UserManage'),
  },
]

let upgradeMode = {
  path: '*',
  component: () => import('@/pages/upgrade/Upgrade'),
}

const routes =
  window.dashboard_conf.upgradeMode === 'True'
    ? [upgradeMode]
    : [
        {
          path: '/',
          component: () => import('@/components/layout'),
          meta: { requiresAuth: true },
          children: layoutChild,
        },
        {
          path: '/login',
          name: 'login',
          component: () => import('@/pages/login/Login'),
        },
        {
          path: '',
          component: () => import('@/pages/login/Login'),
        },
        {
          path: '/bridge',
          component: () => import('@/pages/login/Login'),
        },
        {
          path: '*',
          component: () => import('@/pages/404/404'),
        },
      ]

export default routes

import iconOverview from '../assets/overview.png'
import iconBucket from '../assets/icon-bucket.png'
import iconDashboard from '../assets/icon-dashboard.png'
import iconKey from '../assets/icon-key.png'
import iconSystem from '../assets/system.png'
import iconUser from '../assets/icon-user.png'
import iconVideo from '../assets/icon-video.png'

const systemChildren = [
  {
    index: 1,
    name: 'group',
  },
  {
    index: 2,
    name: 'partition',
  },
  {
    index: 3,
    name: 'traffic',
  },
  {
    index: 4,
    name: 'machine',
  },
]

const videoChildren = [
  {
    index: 1,
    name: 'template',
  },
  {
    index: 2,
    name: 'pipeline',
  },
  {
    index: 3,
    name: 'output',
  },
  {
    index: 4,
    name: 'job',
  },
  {
    index: 5,
    name: 'statistics',
  },
]

const overview = {
  index: 1,
  name: 'overview',
  show: true,
  meta: {
    show: true,
    icon: iconOverview,
    role: ['BASE'],
  },
}

const bucket = {
  index: 2,
  name: 'bucket',
  meta: {
    show: true,
    icon: iconBucket,
    role: ['BASE', 'SUBUSER'],
  },
}

const dashboard = {
  index: 3,
  name: 'dashboard',
  meta: {
    show: true,
    icon: iconDashboard,
    role: ['BASE'],
  },
}

const keychain = {
  index: 4,
  name: 'keychain',
  meta: {
    show: true,
    icon: iconKey,
    role: ['BASE', 'SUBUSER'],
  },
}

const system = {
  index: 6,
  name: 'system',
  meta: {
    show: true,
    icon: iconSystem,
    role: ['OPS'],
  },
  children: systemChildren,
}

const video = {
  index: 5,
  name: 'video',
  children: videoChildren,
  meta: {
    show: window.dashboard_conf.appID === '6',
    icon: iconVideo,
    role: ['TRANSCODE'],
  },
}

const userManage = {
  index: 7,
  name: 'user',
  meta: {
    show: true,
    icon: iconUser,
    role: ['CREATE_USER', 'BIND_USER', 'LIST_USERS', 'WRITE_USER', 'SUB'],
  },
}

const menuList = [
  overview,
  bucket,
  dashboard,
  keychain,
  system,
  video,
  userManage,
]

export default menuList

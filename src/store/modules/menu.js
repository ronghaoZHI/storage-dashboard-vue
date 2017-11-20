import user from './user'
import * as types from '../mutation-types'

import iconOverview from '../../assets/overview.png'
import iconBucket from '../../assets/icon-bucket.png'
import iconDashboard from '../../assets/icon-dashboard.png'
import iconKey from '../../assets/icon-key.png'
import iconSystem from '../../assets/system.png'
import iconUser from '../../assets/icon-user.png'
import iconVideo from '../../assets/icon-video.png'

const systemChildren = [ {
    index: 1,
    name: 'group'
}, {
    index: 2,
    name: 'partition'
}, {
    index: 3,
    name: 'traffic'
}, {
    index: 4,
    name: 'machine'
}]

const videoChildren = [{
    index: 1,
    name: 'template'
}, {
    index: 2,
    name: 'pipeline'
}, {
    index: 3,
    name: 'output'
}, {
    index: 4,
    name: 'job'
}, {
    index: 5,
    name: 'statistics'
}]

const overview = {
    index: 1,
    name: 'overview',
    show: true,
    icon: iconOverview
}

const bucket = {
    index: 2,
    name: 'bucket',
    show: true,
    icon: iconBucket
}

const dashboard = {
    index: 3,
    name: 'dashboard',
    show: true,
    icon: iconDashboard
}

const keychain = {
    index: 4,
    name: 'keychain',
    show: true,
    icon: iconKey
}

const system = {
    index: 6,
    name: 'system',
    show: true,
    icon: iconSystem,
    children: systemChildren
}

const video = {
    index: 5,
    name: 'video',
    show: window.dashboard_conf.appID === '6',
    icon: iconVideo,
    children: videoChildren
}

const userManage = {
    index: 7,
    name: 'user',
    show: true,
    icon: iconUser
}

const ONLINE_SUB = [bucket, keychain]
const ONLINE_ADMIN_NO_SUBSUER = [userManage]


const ONLINE_NORMAL = [overview, bucket, dashboard, keychain, video]
const ONLINE_SUPRER = [overview, bucket, dashboard, keychain, video, userManage]
const ONLINE_ADMIN = [overview, bucket, dashboard, keychain, video, userManage]
const SUPER_ADMIN = [overview, bucket, dashboard, keychain, video, system, userManage]

const state = {
    menuList: user.state.type === 'superadmin' ? SUPER_ADMIN : user.state.type === 'admin' ? (user.state.subUser ? ONLINE_ADMIN : ONLINE_ADMIN_NO_SUBSUER) : (user.state.type === 'super' ? ONLINE_SUPRER : (user.state.type === 'sub' ? ONLINE_SUB : ONLINE_NORMAL))
}

const mutations = {
    [types.REFRESH_MENU] (state) {
        state.menuList = user.state.type === 'superadmin' ? SUPER_ADMIN : user.state.type === 'admin' ? (user.state.subUser ? ONLINE_ADMIN : ONLINE_ADMIN_NO_SUBSUER) : (user.state.type === 'super' ? ONLINE_SUPRER : (user.state.type === 'sub' ? ONLINE_SUB : ONLINE_NORMAL))
    }
}

export default {
    state,
    mutations
}

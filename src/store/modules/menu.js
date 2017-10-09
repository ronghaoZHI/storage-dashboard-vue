import user from './user'
import * as types from '../mutation-types'

import iconBucket from '../../assets/icon-bucket.png'
import iconDashboard from '../../assets/icon-dashboard.png'
import iconKey from '../../assets/icon-key.png'
import iconSystem from '../../assets/icon-system.png'
import iconUser from '../../assets/icon-user.png'
import iconVideo from '../../assets/icon-video.png'

const systemChildren = [{
    index: 1,
    name: 'machine'
}, {
    index: 2,
    name: 'group'
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

const bucket = {
    index: 1,
    name: 'bucket',
    show: true,
    icon: iconBucket
}

const dashboard = {
    index: 2,
    name: 'dashboard',
    show: true,
    icon: iconDashboard
}

const keychain = {
    index: 3,
    name: 'keychain',
    show: true,
    icon: iconKey
}

const system = {
    index: 5,
    name: 'system',
    show: true,
    icon: iconSystem,
    children: systemChildren
}

const video = {
    index: 4,
    name: 'video',
    show: window.dashboard_conf.appID === '6',
    icon: iconVideo,
    children: videoChildren
}

const userManage = {
    index: 6,
    name: 'user',
    show: true,
    icon: iconUser
}

const ONLINE_SUB = [bucket, keychain]
const ONLINE_ADMIN_NO_SUBSUER = [userManage]

const ONLINE_NORMAL = [bucket, dashboard, keychain, video]
const ONLINE_SUPRER = [bucket, dashboard, keychain, video, userManage]
const ONLINE_ADMIN = [bucket, dashboard, keychain, video, system, userManage]

const state = {
    menuList: user.state.type === 'admin' ? (user.state.subUser ? ONLINE_ADMIN : ONLINE_ADMIN_NO_SUBSUER) : (user.state.type === 'super' ? ONLINE_SUPRER : (user.state.type === 'sub' ? ONLINE_SUB : ONLINE_NORMAL))
}

const mutations = {
    [types.REFRESH_MENU] (state) {
        state.menuList = user.state.type === 'admin' ? (user.state.subUser ? ONLINE_ADMIN : ONLINE_ADMIN_NO_SUBSUER) : (user.state.type === 'super' ? ONLINE_SUPRER : (user.state.type === 'sub' ? ONLINE_SUB : ONLINE_NORMAL))
    }
}

export default {
    state,
    mutations
}

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
const isSuper = () => {
    const userInfo = user.state.subUserList.filter(item => item.username === user.state.subUser.username)
    return userInfo && userInfo[0].info.type === 'super'
}
const getMenuList = () => {
    const userType = user.state.type
    let menuList = []
    switch (userType) {
    case 'superadmin':
        menuList = SUPER_ADMIN
        break
    case 'admin':
        menuList = user.state.subUser ? (isSuper() ? ONLINE_ADMIN : ONLINE_NORMAL) : ONLINE_ADMIN_NO_SUBSUER
        break
    case 'super':
        menuList = ONLINE_SUPRER
        break
    case 'sub':
        menuList = ONLINE_SUB
        break
    default:
        menuList = ONLINE_NORMAL
    }
    return menuList
}
const state = {
    menuList: getMenuList()
}

const mutations = {
    [types.REFRESH_MENU] (state) {
        state.menuList = getMenuList()
    }
}

export default {
    state,
    mutations
}

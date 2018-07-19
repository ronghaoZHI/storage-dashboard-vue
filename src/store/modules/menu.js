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
    meta: {
        show: true,
        icon: iconOverview,
        role: ['ONLINE_NORMAL', 'ONLINE_SUPRER', 'ONLINE_ADMIN', 'SUPER_ADMIN'],
    },
}

const bucket = {
    index: 2,
    name: 'bucket',
    meta: {
        show: true,
        icon: iconBucket,
        role: ['ONLINE_SUB', 'ONLINE_NORMAL', 'ONLINE_SUPRER', 'ONLINE_ADMIN', 'SUPER_ADMIN'],
    },
}

const dashboard = {
    index: 3,
    name: 'dashboard',
    meta: {
        show: true,
        icon: iconDashboard,
        role: ['ONLINE_NORMAL', 'ONLINE_SUPRER', 'ONLINE_ADMIN', 'SUPER_ADMIN'],
    },
}

const keychain = {
    index: 4,
    name: 'keychain',
    meta: {
        show: true,
        icon: iconKey,
        role: ['ONLINE_SUB', 'ONLINE_NORMAL', 'ONLINE_SUPRER', 'ONLINE_ADMIN', 'SUPER_ADMIN'],
    },
}

const system = {
    index: 6,
    name: 'system',
    meta: {
        show: true,
        icon: iconSystem,
        role: ['SUPER_ADMIN'],
    },
    children: systemChildren
}

const video = {
    index: 5,
    name: 'video',
    children: videoChildren,
    meta: {
        show: window.dashboard_conf.appID === '6',
        icon: iconVideo,
        role: ['ONLINE_NORMAL', 'ONLINE_SUPRER', 'ONLINE_ADMIN', 'SUPER_ADMIN'],
    },
}

const userManage = {
    index: 7,
    name: 'user',
    meta: {
        show: true,
        icon: iconUser,
        role: ['ONLINE_ADMIN_NO_SUBSUER', 'ONLINE_SUPRER', 'ONLINE_ADMIN', 'SUPER_ADMIN'],
    },
}

const isSuper = () => {
    const userInfo = user.state.subUserList.filter(item => item.username === user.state.subUser.username)
    return userInfo && userInfo[0].info.type === 'super'
}

const getRole = () => {
    const userType = user.state.type
    switch (userType) {
    case 'superadmin':
        return 'SUPER_ADMIN'
    case 'admin':
        return user.state.subUser ? (isSuper() ? 'ONLINE_ADMIN' : 'ONLINE_NORMAL') : 'ONLINE_ADMIN_NO_SUBSUER'
    case 'super':
        return 'ONLINE_SUPRER'
    case 'sub':
        return 'ONLINE_SUB'
    default:
        return 'ONLINE_NORMAL'
    }
}

const hasPermission = (role, route) => {
    if (route.meta && route.meta.role) {
        return route.meta.role.indexOf(role) >= 0
    } else {
        return true
    }
}

const getMenuList = () => {
    const list = [overview, bucket, dashboard, keychain, system, video, userManage]
    const role = getRole()
    const accessMenu = list.filter(m => {
        if (hasPermission(role, m)) {
            if (m.children && m.children.length > 0) {
                m.children = m.children.filter(child => {
                    return hasPermission(role, child) ? child : false
                })
                return m
            } else {
                return m
            }
        }
        return false
    })
    console.log(role, accessMenu)
    return accessMenu
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

import user from './user'
import * as types from '../mutation-types'

import iconBucket from '../../assets/icon-bucket.png'
import iconDashboard from '../../assets/icon-dashboard.png'
import iconKey from '../../assets/icon-key.png'
import iconMachine from '../../assets/icon-machine.png'
import iconUser from '../../assets/icon-user.png'
import iconVideo from '../../assets/icon-video.png'

const bucket = {
    index: 1,
    name: 'bucket',
    icon: iconBucket
}

const dashboard = {
    index: 2,
    name: 'dashboard',
    icon: iconDashboard
}

const keychain = {
    index: 3,
    name: 'keychain',
    icon: iconKey
}

const videoChildren = [{
    index: 1,
    name: 'template'
}]

const video = {
    index: 4,
    name: 'video',
    icon: iconVideo,
    children: videoChildren
}

const machine = {
    index: 5,
    name: 'machine',
    icon: iconMachine
}

const userManage = {
    index: 6,
    name: 'user',
    icon: iconUser
}

const ONLINE_ADMIN_NO_SUBSUER = [userManage]

const ONLINE_SUB = [bucket, keychain]
const ONLINE_NORMAL = [bucket, dashboard, keychain, video]
const ONLINE_SUPRER = [bucket, dashboard, keychain, userManage]
const ONLINE_ADMIN = [bucket, dashboard, keychain, machine, userManage]

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

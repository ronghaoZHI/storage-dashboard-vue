import user from './user'
import * as types from '../mutation-types'

import iconBucket from '../../assets/icon-bucket.png'
import iconDashboard from '../../assets/icon-dashboard.png'
import iconKey from '../../assets/icon-key.png'
import iconMachine from '../../assets/icon-machine.png'

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

const machine = {
    index: 4,
    name: 'machine',
    icon: iconMachine
}

const ONLINE_NORMAL = [bucket, dashboard, keychain]
const ONLINE_ADMIN = [bucket, dashboard, keychain, machine]

const state = {
    menuList: user.state.type === 'super' ? ONLINE_ADMIN : ONLINE_NORMAL
}

const mutations = {
    [types.REFRESH_MENU] (state) {
        state.menuList = user.state.type === 'super' ? ONLINE_ADMIN : ONLINE_NORMAL
    }
}

export default {
    state,
    mutations
}

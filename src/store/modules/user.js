import * as types from '../mutation-types'

const state = {
    ...JSON.parse(sessionStorage.getItem('user'))
}

const mutations = {
    [types.SET_USER_INFO] (state, info) {
        sessionStorage.setItem('user', JSON.stringify(info))
        Object.assign(state, info)
    }
}

export default {
    state,
    mutations
}

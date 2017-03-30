import * as types from '../mutation-types'

const state = {
    login: false,
    userInfo: ''
}

const mutations = {
    [types.USER_INFO](state, info) {
        if (state.userInfo && (state.userInfo.username !== info.username)) {
            return
        }
        if (info.username) {
            state.userInfo = {...info }
            state.login = true
        } else {
            state.userInfo = null
            state.login = false
        }
    },
    [types.IS_LOGIN](state, isLogin) {
        state.login = isLogin
    }
}

export default {
    state,
    mutations
}
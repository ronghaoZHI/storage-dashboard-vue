import * as types from '../mutation-types'
import axios from '../../components/service/axios-bsc'
import { USERINFO } from '../../components/service/API'
import { HOST } from '../../components/service/HOST'

const state = {
    login: false,
    userInfo: null
}

const mutations = {
    [types.USER_INFO](state, info) {
        console.count()
        if (state.userInfo && (state.userInfo.username !== info.username)) {
            return
        }
        if (info.username) {
            state.userInfo = {...info }
            state.login = true
            document.cookie = "is_login=" + info.token + ";domain=" + HOST.domain
        } else {
            state.userInfo = null
            state.login = false
        }
    }
}

export default {
    state,
    mutations
}
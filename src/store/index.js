import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import * as types from './mutation-types'

import bucket from './modules/bucket'
import user from './modules/user'
import menu from './modules/menu'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        token: sessionStorage.getItem('token')
    },
    actions,
    getters,
    mutations: {
        [types.SET_TOKEN] (state, token) {
            sessionStorage.setItem('token', token)
            state.token = token
        },
        [types.LOGOUT] (state) {
            sessionStorage.removeItem('user')
            sessionStorage.removeItem('token')
            state.token = ''
            Object.keys(user.state).forEach(k => Vue.delete(user.state, k))
        }
    },
    modules: {
        bucket,
        user,
        menu
    }
})

export default store

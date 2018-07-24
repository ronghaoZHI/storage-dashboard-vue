import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import * as types from './mutation-types'

import bucket from './modules/bucket'
import user from './modules/user'
import menu from './modules/menu'
import errorLog from './modules/errorLog'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        token: sessionStorage.getItem('token'),
        theme: sessionStorage.getItem('theme') || 'dark',
        miniMenu: false
    },
    actions,
    getters,
    mutations: {
        [types.SET_TOKEN] (state, token) {
            sessionStorage.setItem('token', token)
            state.token = token
        },
        [types.TOGGLE_THEME] (state, theme) {
            state.theme = theme
            sessionStorage.setItem('theme', theme)
        },
        [types.TOGGLE_MINIMENU] (state, miniMenu) {
            state.miniMenu = miniMenu
            sessionStorage.setItem('miniMenu', miniMenu)
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
        menu,
        errorLog,
    }
})

export default store

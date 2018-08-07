import Vue from 'vue'
import Vuex from 'vuex'

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
    actions: {
        setToken ({ commit }, token) {
            token.length > 1 && commit('SET_TOKEN', token)
        },
        toggleTheme ({ commit }, theme) {
            commit('TOGGLE_THEME', theme)
        },
        toggleMiniMenu ({ commit }, miniMenu) {
            commit('TOGGLE_MINIMENU', miniMenu)
        },
        logout ({ commit }) {
            commit('LOGOUT')
        },
    },
    mutations: {
        SET_TOKEN (state, token) {
            sessionStorage.setItem('token', token)
            state.token = token
        },
        TOGGLE_THEME (state, theme) {
            state.theme = theme
            sessionStorage.setItem('theme', theme)
        },
        TOGGLE_MINIMENU (state, miniMenu) {
            state.miniMenu = miniMenu
            sessionStorage.setItem('miniMenu', miniMenu)
        },
        LOGOUT (state) {
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

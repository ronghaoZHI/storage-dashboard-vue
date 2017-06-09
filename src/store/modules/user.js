import Vue from 'vue'
import * as types from '../mutation-types'

const state = {
    ...JSON.parse(sessionStorage.getItem('user'))
}

const mutations = {
    [types.LOGIN] (state, info) {
        sessionStorage.setItem('user', JSON.stringify(info))
        Object.assign(state, info)
    },
    [types.LOGOUT] (state) {
        sessionStorage.removeItem('user')
        Object.keys(state).forEach(k => Vue.delete(state, k))
    }
}

export default {
    state,
    mutations
}

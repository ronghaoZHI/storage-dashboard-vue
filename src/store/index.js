import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'

import bucket from './modules/bucket'

Vue.use(Vuex)

const store = new Vuex.Store({
    actions,
    getters,
    modules: {
        bucket
    },
    state: {

    },
    mutations: {}
})

export default store
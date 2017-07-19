import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'

import bucket from './modules/bucket'
import user from './modules/user'
import menu from './modules/menu'

Vue.use(Vuex)

const store = new Vuex.Store({
    actions,
    getters,
    modules: {
        bucket,
        user,
        menu
    }
})

export default store

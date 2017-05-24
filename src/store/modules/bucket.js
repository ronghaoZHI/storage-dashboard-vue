import * as types from '../mutation-types'

const state = {
    selectedBucket: {}
}

const mutations = {
    [types.SELECTED_BUCKET] (state, bucket) {
        state.selectedBucket = bucket
    }
}

export default {
    state,
    mutations
}

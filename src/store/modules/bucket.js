import * as types from '../mutation-types'

const state = {
    selectedBucket: {},
    bucketList: []
}

const mutations = {
    [types.SELECTED_BUCKET] (state, bucket) {
        state.selectedBucket = bucket
    },
    [types.BUCKET_LIST] (state, list) {
        state.bucketList = list
    }
}

export default {
    state,
    mutations
}

const state = {
    selectedBucket: {},
    bucketList: []
}

const mutations = {
    SELECTED_BUCKET (state, bucket) {
        state.selectedBucket = bucket
    },
    BUCKET_LIST (state, list) {
        state.bucketList = list
    }
}

const actions = {
    selectedBucket ({ commit }, bucket) {
        bucket.Name && commit('SELECTED_BUCKET', bucket)
    },
    setBucketList ({ commit }, list) {
        commit('BUCKET_LIST', list)
    },
}

export default {
    state,
    mutations,
    actions,
}

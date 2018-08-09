import { getBuckets } from '@/service/Data'

const state = {
    buckets: {}
}

const mutations = {
    SET_BUCKETS (state, bukcets) {
        state.buckets = bukcets
    }
}

const actions = {
    setBuckets ({ commit }, bukcets) {
        commit('SET_BUCKETS', bukcets)
    },
    async getBuckets ({ commit, state }) {
        if (Object.keys(state.buckets).length === 0) {
            let buckets = await getBuckets()
            commit('SET_BUCKETS', buckets)
        }
    },
}

export default {
    state,
    mutations,
    actions,
}

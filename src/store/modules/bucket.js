import { handler } from '@/service/Aws'

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
            let buckets = await handler('listBuckets')
            commit('SET_BUCKETS', buckets)
            return buckets
        } else {
            return state.buckets
        }
    },
}

const getters = {
    buckets (state) {
        return state.buckets.Buckets
    }
}

export default {
    state,
    mutations,
    actions,
    getters,
}

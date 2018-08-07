const state = {
    ...JSON.parse(sessionStorage.getItem('user'))
}

const mutations = {
    SET_USER_INFO (state, info) {
        sessionStorage.setItem('user', JSON.stringify(info))
        Object.assign(state, info)
    }
}

const actions = {
    setUserInfo ({ commit }, info) {
        info.username && commit('SET_USER_INFO', info)
    },
}

export default {
    state,
    mutations,
    actions,
}

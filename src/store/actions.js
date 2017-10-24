import * as types from './mutation-types'

export const selectBucket = ({ commit }, bucket) => bucket.Name && commit(types.SELECTED_BUCKET, bucket)
export const setUserInfo = ({ commit }, info) => info.username && commit(types.SET_USER_INFO, info)
export const setToken = ({ commit }, token) => token.length > 1 && commit(types.SET_TOKEN, token)
export const setBucketList = ({ commit }, list) => commit(types.BUCKET_LIST, list)
export const toggleTheme = ({ commit }) => commit(types.TOGGLE_THEME)
export const logout = ({ commit }) => commit(types.LOGOUT)
export const refreshMenu = ({ commit }) => commit(types.REFRESH_MENU)

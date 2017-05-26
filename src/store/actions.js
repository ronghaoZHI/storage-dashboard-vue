import * as types from './mutation-types'

export const selectBucket = ({ commit }, bucket) => bucket.Name && commit(types.SELECTED_BUCKET, bucket)
export const setUserInfo = ({ commit }, info) => info.username && commit(types.LOGIN, info)
export const logout = ({ commit }) => commit(types.LOGOUT)
export const getMenuList = ({ commit }) => commit(types.GET_MENU_LIST)
export const setLoading = ({ commit }, bol) => commit(types.LOADING, bol)

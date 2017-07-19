import * as types from './mutation-types'

export const selectBucket = ({ commit }, bucket) => bucket.Name && commit(types.SELECTED_BUCKET, bucket)
export const setUserInfo = ({ commit }, info) => info.username && commit(types.LOGIN, info)
export const setBucketList = ({ commit }, list) => commit(types.BUCKET_LIST, list)
export const logout = ({ commit }) => commit(types.LOGOUT)
export const refreshMenu = ({ commit }) => commit(types.REFRESH_MENU)
